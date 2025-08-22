import {
	interval,
	from,
	of,
	range,
	last,
	map,
	merge,
	mergeMap,
	concatMap,
	scan,
	take,
	toArray,
	reduce,
	repeat,
	type Observable,
} from "rxjs";

// Stub value to indicate an implementation
export type IMPLEMENT_THIS_TYPE = any;
export const IMPLEMENT_THIS: IMPLEMENT_THIS_TYPE = undefined;

const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q", "K"] as const;
const suits = ["♠", "♣", "♦", "♥"] as const;

// use typeof to define string literal types
type Rank = (typeof ranks)[number]; // 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K'
type Suit = (typeof suits)[number]; // '♠' | '♥' | '♢' | '♡'

type Card = Readonly<{
	suit: Suit;
	rank: Rank;
}>;

const deckSize = ranks.length * suits.length;

/**
 * Exercise 1: Create a deck of cards over all suits and ranks dealt as a stream.
 * /Hint/: use `from` to create streams from the arrays and `concatMap` to combine them
 */
const deck$: Observable<Card> = from(suits).pipe(concatMap(suit => from(ranks).pipe(concatMap(rank => of({ suit: suit, rank: rank })))));

/**
 * An impure random number generator for use in shuffling
 * @param n random number range is [0,n]
 * @returns a random integer in the range [0,n]
 */
function impureRandomNumberGenerator(n: number) {
	return Math.floor(Math.random() * (n + 1)); // impure!!
}

/**
 * Exercise 2: Insert an element at a random position in an array
 * Use array.slice and spread (...) to insert the element
 * and impureRandomNumberGenerator to find the insertion point.
 */
const randomInsert: <T>(a: ReadonlyArray<T>, e: T) => ReadonlyArray<T> = (a, e) => {
	const randomIndex = impureRandomNumberGenerator(a.length - 1);
	return [...a.slice(0, randomIndex), e, ...a.slice(randomIndex)];
};



/**
 * A specific version of randomInsert for Card
 */
const shuffleInsert = randomInsert<Card>;

/**
 * Exercise 3: Create a shuffled shoe as a stream of `deckCount` decks of cards.
 *
 * /Hint/: use range, concatMap, reduce, and shuffleInsert above.
 * The final step in the pipe will be to convert the array back into a stream.  How?
 *
 * @param deckCount number of decks to put in the shoe
 * @returns a stream of shuffled Card
 */
const shoe$: (deckCount: number) => Observable<Card> = (deckCount) =>
	range(deckCount).pipe(
		mergeMap(() => deck$),
		reduce((acc: ReadonlyArray<Card>, card: Card) => shuffleInsert(acc, card), [] as ReadonlyArray<Card>),
		mergeMap((shuffledCard) => from(shuffledCard))
	);

shoe$(1).subscribe(console.log)

/**
 * Exercise 4: scan over specified stream of cards to compute the count.
 *
 * Quote (The Card Counter 2022):
 * https://www.youtube.com/watch?v=av5qcPPRo7Q
 *    What separates Blackjack from other games is that it’s based on dependent
 *    events, meaning past affects the probability in the future. The house has a
 *    1.5 percent advantage. If a player knows the nature of the cards in the shoe
 *    he can turn the house advantage to himself. To do this he has to keep track
 *    of every card that is played. The count is based on a high low system. High
 *    cards, ten, jack, queen, king have a value of minus one. If they are
 *    depleted, player’s advantage goes down. The low cards, two, three, four,
 *    five, six have a value of plus one. The seven, eight and nine have no count
 *    value. The player keeps track of every card and calculates the running count.
 *    The Dealer distributes cards from the shoe. Then the player arrives at
 *    the true count, which is the running count divided by the decks remaining.
 *    For example, if the running count is plus nine and there are four and a half
 *    decks remaining, nine over four and a half gives you a true count of plus
 *    two. As true count increases, the player’s advantage increases. The idea is
 *    to bet little when you don’t have the advantage and proportionately more when
 *    you do.
 *
 * in other words:
 * cards rank T-A decrement the count, cards 2-6 increment the count
 * true count is Math.floor(runningCount / decksRemaining)
 * where:
 *    cardsAvailable = deckCount * deckSize
 *    decksRemaining = (cardsAvailable - cardsDealt) / deckSize
 * @param deckCount assume the cardStream contains this many decks
 * @param cardStream stream of Card
 * @returns a stream of the running Count stats
 */
type Count = Readonly<{
	card?: Card
	runningCount: number,
	cardsDealt: number
	trueCount?: number,
}>

const count$: (
	deckCount: number,
	cardStream: Observable<Card>,
) => Observable<Count> = (decks, cards$) =>
		cards$.pipe(scan(countCards(decks), { runningCount: 0, cardsDealt: 0 }))

const countCards: (deckCount: number) => (a: Count, c: Card) => Count =
	deckCount => (a, card) => {
		const highRanks: Rank[] = ["T", "J", "Q", "K", "A"];
		const lowRanks: Rank[] = ["2", "3", "4", "5", "6"];
		let delta = 0;
		if (highRanks.includes(card.rank)) delta = -1;
		else if (lowRanks.includes(card.rank)) delta = 1;
		// 7,8,9 are zero
		const cardsDealt = a.cardsDealt + 1;
		const cardsAvailable = deckCount * deckSize;
		const decksRemaining = (cardsAvailable - cardsDealt) / deckSize;
		const runningCount = a.runningCount + delta;
		return {
			card,
			runningCount: runningCount,
			cardsDealt: cardsDealt,
			trueCount: decksRemaining > 0 ? Math.floor(runningCount / (decksRemaining)) : undefined,
		};
	};

 
/**
 * Deal and count cards from a shoe of the specified size.
 * Exercise 5:
 * @param {number} number of decks in the shoe
 * @returns {Observable<Count>} a stream of Counts
 */
const deal$: (n: number) => Observable<Count> = (n) => count$(n, shoe$(n));

export { Card, count$, deck$, shoe$, deal$, deckSize, Count, randomInsert };
