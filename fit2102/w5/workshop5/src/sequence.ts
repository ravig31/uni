type Selector<T> = (v: T, s: Sequence<T>) => T | Sequence<T>;
type Sequence<T> = (s: Selector<T>) => T | Sequence<T>;

// Replace incidences of YOUR_CODE_HERE below with your solution
const YOUR_CODE_HERE = "\x1b[31m\x1b[4mFIX ME!\x1b[0m" as any;

function lazyNaturalNumbers(v: number): Sequence<number> {
	return selector => selector(v, lazyNaturalNumbers(v + 1));
}

const log = (label: string) => (output: any) => console.log(`${label}: ${output}`);

console.log("========== Exercise 1 =====================");
// for the above lazyNaturalNumbers sequence define trivial functions `value` and `next`
// such that:
//   lazyNaturalNumbers(1)(value) === 1
//   lazyNaturalNumbers(1)(next)(value) === 2
// and so on...
function value<T>(v: T, s: Sequence<T>): T {
	return v;
}
function next<T>(v: T, s: Sequence<T>): Sequence<T> {
	return s;
}

const fromThree = lazyNaturalNumbers(3);
const fromFour = fromThree(next) as Sequence<number>;

log("First value of natural numbers from 3 should be 3")(fromThree(value));
log("Next number should be 4")(fromFour(value));

// ============================================

const head = <T>(seq: Sequence<T>) => seq(value) as T;
const rest = <T>(seq: Sequence<T>) => seq(next) as Sequence<T>;

function applyN<T>(n: number, f: (_: T) => void, seq: Sequence<T>) {
	if (n) {
		f(head(seq));
		applyN(n - 1, f, rest(seq));
	}
}

// type Sequence<T> = (s:Selector<T>) => T|Sequence<T>
console.log("\n========== Exercise 2 =====================");
// implement map - use head and rest
function map<T, U>(f: (_: T) => U, seq: Sequence<T>): Sequence<U> {
	return selector => selector(f(head(seq)), map(f, rest(seq)))
}

log("Map 2* over fromThree first should be 6")(head(map(x => 2 * x, fromThree)));
log("Map 2* over fromThree second should be 8")(head(map(x => 2 * x, fromFour)));

console.log("\n========== Exercise 3 =====================");
// implement getNth where getNth(1)(seq) returns the head of seq
function getNth<T>(n: number, seq: Sequence<T>): T {
	return n === 1 ? head(seq) : getNth(n - 1, rest(seq))
}

log("1st of fromThree should be 3")(
	getNth(1, fromThree)
)
log("10th map of 2* fromThree should be 24")(
	getNth(
		10,
		map(x => 2 * x, fromThree),
	),
);

console.log("\n========== Exercise 4 =====================");
// implement a function which creates a sequence from a given initial value
// and a function to compute the next value from a previous value
function makeSequence<T>(init: T, next: (previous: T) => T): Sequence<T> {
	return selector => selector(init, makeSequence(next(init), next));
}

/**
 * selector => selector(1, makeSequence(2, x=>x+1)
 * selector => selector(2, makeSequence(3, x=>x+1))
 * selector => selector(2, makeSequence(4, x=>x+1))
 * If selector = value, you get 1.
 * If selector = next, you get makeSequence(2, x => x + 1), i.e.
 */

const nats = makeSequence(1, x => x + 1);
log("first natural number is")(head(nats));
log("fifth natural number is")(getNth(5, nats));

console.log("\n========== Exercise 5 =====================");
// compute a sequence of Fibonacci pairs given that the first two fibonacci numbers are 1,1.
type FibPair = [number, number];
const firstFibPair: FibPair = [1, 1];
const nextFibPair: (a: FibPair) => FibPair = ([a, b]) => [b, a + b];

const fibPairs = makeSequence(firstFibPair, nextFibPair);
const fibs = map(x => x[0], fibPairs);

applyN(9, log("Fibonacci numbers"), fibs);

log("10th fib should be 55")(getNth(10, fibs));

console.log("\n========== Exercise 6 =====================");
function scan<T, U>(f: (a: U, v: T) => U, seq: Sequence<T>, init: U): Sequence<U> {
	return selector => selector(f(init, head(seq)), scan(f, rest(seq), f(init, head(seq))));
}

const cumulativeTotals = scan((x, y) => x + y, lazyNaturalNumbers(1), 0);
console.log("Cumulative totals over natural numbers:");
applyN(9, log("Cumulative Total"), cumulativeTotals);

log("sum 1 to 10 should be 55")(getNth(10, cumulativeTotals));

console.log("\n========== Exercise 7 =====================");
// Make a function which for the given sequence returns a sequence of adjacent pairs
function pairise<T>(seq: Sequence<T>): Sequence<[T, T]> {
	return selector => selector([head(seq), head(rest(seq))], pairise(rest(seq)));
}
console.log("Naturals:");
// expect: 
// [ 1, 2 ]
// [ 2, 3 ]
// [ 3, 4 ]
applyN(3, console.log, pairise(nats));

console.log("Fib pairs:");
applyN(10, console.log, pairise(fibs));

console.log("\n========== Exercise 8 =====================");
// create a sequence of increasingly accurate golden ratio approximations
const goldenRatioApproximations = map((fibpair: FibPair) => fibpair[1] / fibpair[0], fibPairs);

log("The Golden Ratio is close to 1.618")(getNth(100, goldenRatioApproximations));

export {
	lazyNaturalNumbers,
	head,
	fibs,
	fromThree,
	fromFour,
	cumulativeTotals,
	value,
	getNth,
	scan,
	map,
	goldenRatioApproximations,
};
