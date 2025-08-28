const {
    cons,
    head,
    tail,
    NULL,
    K,
    I,
    fromArray,
    toArray,
    luckiestStudent,
    fold,
    length,
    forEach,
    flip,
    reverse,
    marks,
    map,
    zip,
    filter,
    sort,
    concat,
    join,
    pipe,
    concatMap,
} = require("./conslist"); 

describe("Basic cons lists", function () {
    const l123 = cons(1)(cons(2)(cons(3)(NULL)));
    it("cons", function () {
        expect(l123(K)).toBe(1);
        expect(l123(K(I))(K)).toBe(2);
    });
    it("head", function () {
        expect(head(l123)).toBe(1);
    });
    it("head, tail", function () {
        expect(head(tail(l123))).toBe(2);
        expect(head(tail(tail(l123)))).toBe(3);
    });
});

describe("Given Code", function () {
    const l123 = cons(1)(cons(2)(cons(3)(NULL)));
    it("fold", function () {
        expect(fold(x => y => x + y)(0)(l123)).toBe(6);
    });
    it("length", function () {
        expect(length(NULL)).toBe(0);
        expect(length(l123)).toBe(3);
    });
    it("toArray", function () {
        expect(toArray(l123)).toEqual([1, 2, 3]);
    });
    it("flip", function () {
        expect(flip(fold(x => y => x + y))(l123)(0)).toBe(6);
    });
    it("reverse", function () {
        const r = reverse(l123);
        expect(toArray(r)).toEqual([3, 2, 1]);
    });
    it("forEach", function () {
        let i = 0,
            a = [];
        forEach(v => (a[i++] = v))(l123);
        expect(a).toEqual([1, 2, 3]);
    });
    it("map", function () {
        const r = map(x => x ** 2)(l123);
        expect(toArray(r)).toEqual([1, 4, 9]);
    });
    it("fromArray", function () {
        const r = fromArray([1, 2, 3]);
        expect(toArray(r)).toEqual([1, 2, 3]);
    });
    it("concat", function () {
        const l1 = fromArray([1, 2, 3]),
            l2 = fromArray([4, 5, 6]),
            r = concat(l1)(l2);
        expect(toArray(r)).toEqual([1, 2, 3, 4, 5, 6]);
    });
    it("pipe", function () {
        const r = pipe(
            9,
            x => 2 * x,
            x => x - 1,
            x => x ** 2,
        );
        expect(r).toBe(289);
    });
});
describe("Exercises", function () {
    describe("Exercise 1: join", function () {
        it("join", function () {
            const l1 = fromArray([1, 2]),
                l2 = fromArray([3, 4]),
                l3 = fromArray([5, 6]);
            const nested = cons(l1)(cons(l2)(cons(l3)(NULL)));
            expect(length(nested)).toBe(3);
            const flattened = join(nested);
            expect(length(flattened)).toBe(6);
            expect(toArray(flattened)).toEqual([1, 2, 3, 4, 5, 6]);
        });
    });
    describe("Exercise 2: concatMap", function () {
        it("concatMap", function () {
            const a = [fromArray([1, 2]), fromArray([3, 4]), fromArray([5, 6])];
            const ids = fromArray([0, 1, 2]);
            const f = i => a[i];
            const flattened = concatMap(f)(ids);
            expect(length(flattened)).toBe(6);
            expect(toArray(flattened)).toEqual([1, 2, 3, 4, 5, 6]);
        });
    });
    describe("Exercise 3: zip", function () {
        try {
            // in case fromArray isn't working yet because unfinished head/tail
            const l15 = fromArray([1, 2, 3, 4, 5]);
            const labc = fromArray("abc".split(""));
            it("zip is a 3ary curried function", function () {
                expect(typeof zip).toBe("function");
                expect(typeof zip()).toBe("function");
                expect(typeof zip()()).toBe("function");
                expect(typeof zip()()()).toBe("undefined");
            });
            it("zip of two empty lists is an empty list", function () {
                expect(zip(head)(NULL)(NULL)).toBe(NULL);
            });
            it("zip of an empty list and a non-empty list is an empty list", function () {
                expect(zip(head)(NULL)(l15)).toBe(NULL);
            });
            it("zip of an empty list and a non-empty list is an empty list", function () {
                expect(zip(head)(NULL)(l15)).toBe(NULL);
            });
            it("zip with [,] of [1,2,3,4,5] and [a,b,c] is [[1,a],[2,b],[3,c]]", function () {
                const r = zip(a => b => [a, b])(l15)(labc);
                expect(toArray(r)).toEqual([
                    [1, "a"],
                    [2, "b"],
                    [3, "c"],
                ]);
            });
        } catch (e) {
            console.log(e);
        }
    });
    describe("Exercise 4: filter", function () {
        it("filter is a 2ary curried function", function () {
            expect(typeof filter).toBe("function");
            expect(typeof filter()).toBe("function");
            expect(typeof filter()()).toBe("undefined");
        });
        it("filter empty list is empty list", function () {
            expect(filter()(NULL)).toBe(NULL);
        });
        it("filter odds contains all odds", function () {
            const f = v => v % 2;
            const r = filter(f)(fromArray([5, 3, 6, 78, 2, 21, 4, 63, 2]));
            expect(toArray(r)).toEqual([5, 3, 21, 63]);
        });
    });
    describe("Exercise 5: sort", function () {
        it("sort is a 2ary curried function", function () {
            expect(typeof sort).toBe("function");
            expect(typeof sort()).toBe("function");
            expect(typeof sort()()).toBe("undefined");
        });
        it("sort empty list is empty list", function () {
            expect(sort()(NULL)).toBe(NULL);
        });
        it("sort some numbers", function () {
            const f = a => b => a - b,
                unsorted = fromArray([4, 8, 1, 3, 5, 8, 6]),
                r = sort(f)(unsorted);
            expect(toArray(r)).toEqual([1, 3, 4, 5, 6, 8, 8]);
        });
    });
    describe("Exercise 6: data processing", function () {
        it("Name of student", function () {
            expect(luckiestStudent).toBe("Aimee Pham");
        });
    });
});
