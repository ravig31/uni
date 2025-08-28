const NULL = undefined,
    YOUR_CODE_HERE = undefined,
    I = x => x,
    K = x => y => x,
    cons = x => y => f => f(x)(y);

///////////////////////////////////
// Exercise 0:
// Write down the K and I combinators in lambda calculus (use λ or \ for lambda char)
//    I = λx.x
//    K = λxy.x
// Now evaluate (show all the steps):
//    K(I) = λx.λy.x(λx.x)
//         = λy.λx.x [x:=λx.x]
//         = λyx.x = λxy.y

///////////////////////////////////
// Exercise 1:
// In this week's lecture video we defined head and tail as:
//     l=>l(head=>tail=>head) and l=>l(head=>tail=>tail) respectively.
// Complete the implementations below using only the K and I combinators.

const head = l => l(K),
    tail = l => l(K(I));

///// Here's a handy library of functions for working with conslists:
const fold = f => i => l => l ? fold(f)(f(i)(head(l)))(tail(l)) : i,
    length = fold(x => _ => x + 1)(0),
    flip = f => a => b => f(b)(a),
    reverse = fold(flip(cons))(NULL),
    forEach = f => fold(K(I(f)))(NULL),
    map = f => l => l ? cons(f(head(l)))(map(f)(tail(l))) : NULL,
    fromArray = a => reverse(a.reduce((c, v) => cons(v)(c), NULL)),
    toArray = fold(a => v => a.concat([v]))([]),
    concat = a => b => a ? cons(head(a))(concat(tail(a))(b)) : b, //concat two cons-list
    compose = f => g => x => f(g(x)),
    // pipe chains a comma separated list of functions starting with f(x)
    // TS typing for this is challenging but possible,
    // see https://dev.to/ecyrbe/how-to-use-advanced-typescript-to-define-a-pipe-function-381h
    pipe = (arg, firstFn, ...fns) => fns.reduce((acc, fn) => fn(acc), firstFn(arg));

///////////////////////////////////
// Exercise 2:
// flatten a nested list
const join = l => (l ? cons(head(l))(join(tail(l)))(concat) : null);

///////////////////////////////////
// Exercise 3:
// concatMap using map and join
const concatMap = f => l => join(map(f)(l)); // why can't you have map(f)(join(l))

///////////////////////////////////
// Exercise 4:
// implement zip, such that:
// forEach(console.log)(
//   zip(a=>b=>[a,b])
//       (cons(1)(cons(2))(NULL)))
//       (cons('a')(cons('b'))(NULL)))
// )
// [1,'a']
// [2,'b']
const zip = f => l1 => l2 => {
    if (l1 === NULL || l2 === NULL) {
        return NULL;
    }

    return cons(
        f(head(l1))(head(l2)), // call the zipping implementation with next 2 elements (curried)
    )(zip(f)(tail(l1))(tail(l2)));
};

///////////////////////////////////
// Exercise 5:
// Create the filter function using fold instead of using recursion yourself
// print(filter(x=>x>=50)(fromArray(marks)));
// expect:
//  only marks over 50...

const filter = f => l =>
    reverse(
        fold(
            acc => value => f(value) ? cons(value)(acc) : acc,
            // if filter -> cons the accumulated list with the current value
            // other wise return just the accumulated list
        )(NULL)(l),
    );

///////////////////////////////////
// Exercise 6:
// Implement a function `sort` which takes a compare function and a list
// and sorts the element	s of the list according to compare.
// The compare function should take arguments a and b and return a number,
// <=0: if a <= b,
// >0: if a>b
// Use the quicksort algorithm with your filter function:
// quicksort f l =
//   if l is empty then return empty list
//   else
//    p = head l
//    l1 = all the elements of l smaller-than or equal-to p
//    l2 = all the elements of l greater-than p
//    return (quicksort l1) ++ [p] ++ (quicksort l2)
const sort = f => l => {
    if (l === NULL) {
        return NULL;
    }
    const p = head(l);
    const left = filter(x => f(x)(p) <= 0)(tail(l));
    const right = filter(x => f(x)(p) > 0)(tail(l));

    return concat(concat(sort(f)(left))(cons(p)(NULL)))(sort(f)(right));
};

///////////////////////////////////
// Exercise 7:
const students = [
    "Valentino Dalton",
    "Hayden Walton",
    "Jane Bryant",
    "Ronald Hayes",
    "Journey Bradshaw",
    "Matias Guzman",
    "Jaylah Hunt",
    "Dangelo Russell",
    "Giovani Hendricks",
    "Faith Tapia",
    "Jonas Foster",
    "Perla Palmer",
    "Sara Ferrell",
    "Ezequiel Choi",
    "David Spencer",
    "Chaim Kennedy",
    "Ty Mccann",
    "Noelle Moses",
    "Shayna Contreras",
    "Lorelai Thornton",
    "Brianna Hernandez",
    "Keely Rojas",
    "Gemma Casey",
    "Elaine Merritt",
    "Santino Estrada",
    "Dayana Roach",
    "Roberto Hubbard",
    "Lucille Matthews",
    "Sariah Gaines",
    "Marisa Sharp",
    "Nancy Odom",
    "Gerald Greene",
    "Julie Gay",
    "Beatrice Wallace",
    "Carly York",
    "Shirley Reid",
    "Grant Wood",
    "Angelo Ferguson",
    "Gianni Camacho",
    "Kenya Rivers",
    "Peyton Roman",
    "Leonard Flores",
    "Lincoln French",
    "Ryland Evans",
    "Elsie Yoder",
    "Kristian Ochoa",
    "Clarence Benitez",
    "Kole Banks",
    "Jeffrey Heath",
    "Nasir Davenport",
    "Grady Nielsen",
    "Zayden Parrish",
    "Christine Blackwell",
    "Javon Garrett",
    "Kaydence Phelps",
    "Uriel Garcia",
    "Antwan Park",
    "Sharon Rangel",
    "Nelson Gutierrez",
    "Gilbert Carroll",
    "Ashlynn Small",
    "Jordyn Owens",
    "Lilah Obrien",
    "Nyla Crane",
    "Jillian Becker",
    "Wyatt Vaughan",
    "Christian Oconnor",
    "Alexandra Francis",
    "Amari Hebert",
    "Richard Peterson",
    "Fisher Keith",
    "Carlee Galloway",
    "Pablo Compton",
    "Gabriella Horn",
    "Sylvia Leblanc",
    "Serena Berry",
    "Uriah Jensen",
    "Cesar Gilbert",
    "Amelie Cooley",
    "Elianna Cross",
    "Selena Shaw",
    "Leon Ramsey",
    "Salma Reese",
    "Cameron Valenzuela",
    "Madilynn Daugherty",
    "Judith Castro",
    "Tia Stokes",
    "Martin Ritter",
    "Jameson Bowen",
    "Ramon Ewing",
    "Jorge Austin",
    "Precious Walsh",
    "Timothy Scott",
    "Laurel Lang",
    "Addison Mayo",
    "Abigayle Walker",
    "Aimee Pham",
    "Adam Harris",
    "Mckinley Gilmore",
    "Devon Cantrell",
];
const marks = [
    "84.51",
    "42.85",
    "57.03",
    "52.99",
    "65.39",
    "35.57",
    "11.88",
    "61.11",
    "61.70",
    "56.75",
    "29.37",
    "57.52",
    "29.91",
    "23.82",
    "65.98",
    "66.19",
    "41.97",
    "49.83",
    "89.81",
    "73.43",
    "65.34",
    "36.04",
    "26.93",
    "69.62",
    "62.29",
    "100.00",
    "64.56",
    "26.02",
    "37.39",
    "72.88",
    "76.87",
    "11.56",
    "64.37",
    "54.36",
    "37.90",
    "53.10",
    "30.05",
    "7.23",
    "62.38",
    "66.83",
    "34.46",
    "47.67",
    "52.64",
    "47.11",
    "42.91",
    "37.53",
    "40.05",
    "58.42",
    "67.54",
    "54.26",
    "27.43",
    "64.56",
    "43.99",
    "33.41",
    "55.36",
    "30.65",
    "46.18",
    "9.50",
    "30.74",
    "42.86",
    "78.97",
    "63.15",
    "42.26",
    "43.44",
    "53.71",
    "48.35",
    "8.16",
    "59.47",
    "76.78",
    "27.44",
    "59.80",
    "48.85",
    "78.54",
    "46.37",
    "47.15",
    "18.98",
    "48.49",
    "6.73",
    "51.98",
    "52.87",
    "43.16",
    "30.64",
    "0.00",
    "69.87",
    "50.71",
    "72.59",
    "28.07",
    "40.23",
    "7.15",
    "53.49",
    "61.51",
    "10.91",
    "41.24",
    "59.17",
    "44.35",
    "42.08",
    "50.44",
    "14.68",
    "20.82",
    "31.30",
];

// functions for zipping and unzipping students and their marks
const student = name => mark => ({ name, mark }),
    name = ({ name }) => name,
    mark = ({ mark }) => mark,
    compareMarks = a => b => mark(a) - mark(b),
    pass = s => mark(s) >= 50;

// use the functions above to find the
// name of the student who passed with the lowest mark
const pairs = zip(student)(fromArray(students))(fromArray(marks)),
    passed = filter(pass)(pairs),
    sorted = sort(compareMarks)(passed);

const luckiestStudent = name(head(sorted));

module.exports = {
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
};
