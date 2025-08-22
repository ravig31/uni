import { describe, expect, it } from "vitest";
import { toArray, reduce, from, zip, lastValueFrom, range } from "rxjs";
import { deck$, deckSize, shoe$, count$, randomInsert, deal$ } from "../src/exercises";
import { testShoeCount } from "./practiceDeck";

describe("Exercise 1: deck$", () => {
    const count = reduce(n => n + 1, 0);
    it("Deck has 52 cards", async () => {
        const r = await lastValueFrom(deck$.pipe(count));
        expect(r).toBe(deckSize);
    });
});

describe("Exercise 2: randomInsert", async () => {
    const size = 1000;
    const array = await lastValueFrom(range(size).pipe(toArray()));
    const shuffled = array.reduce(randomInsert<number>, []);
    it("shuffled array is different to input array", () =>
        expect(shuffled).to.not.deep.equal(array))
    it("sorted shuffled array is same as input array", ()=>
        expect(shuffled.slice().sort((a, b) => a - b)).to.deep.equal(array))
    it("random inserts into every position", () => {
        const posns = array
            .map(_ => randomInsert([1, 2], 3))
            .map(t => t.indexOf(3))
            .reduce((s, e) => s.add(e), new Set());
        expect(posns.size).to.equal(3);
    });
});

describe("Exercise 3: shoe$", () => {
    const count = reduce(n => n + 1, 0);
    it("Shoe has deckCount*52 cards", async () => {
        const deckCount = 6;
        const r = await lastValueFrom(shoe$(deckCount).pipe(count));
        expect(r).toBe(deckCount * deckSize);
    });
});

describe("Exercise 4: count$", () => {
    it("Count works as expected on baseline deck", async () => {
        const r = await lastValueFrom(
            zip(
                count$(
                    Math.floor(testShoeCount.length / 52),
                    from(testShoeCount.map(c => c.card)),
                ),
                from(testShoeCount.map(c => c.trueCount)),
            ).pipe(toArray()),
        );
        r.forEach(([r, e]) => expect(r.trueCount).toBe(e));
    });
});

describe("Exercise 5: deal$", async () => {
    const deckCount = 4;
    const all = await lastValueFrom(deal$(deckCount).pipe(toArray()));
    const lastCount = all[all.length - 1];
    it("emits n*deckSize counts and ends with runningCount 0 and trueCount undefined", () => 
        expect(all.length).toBe(deckCount * deckSize))
    it("final Count.cardsDealt includes all cards", () =>
        expect(lastCount.cardsDealt).toBe(deckCount * deckSize))
    it("final Count.runningCount is 0", () => 
        expect(lastCount.runningCount).toBe(0))
    it("final trueCount is undefined", () =>
        expect(lastCount.trueCount).toBe(undefined))
});
