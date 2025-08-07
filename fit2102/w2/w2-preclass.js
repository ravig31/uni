 const numbers = [2, 6, 3, 7, 10];
 const result = [];
 for (let i = 0; i < numbers.length; i++) {
     if (numbers[i] % 2 === 0) {
         result.push(numbers[i] / 2);
     }
 }

 console.log(result)

 const task1 = numbers.filter((x) => (x % 2 === 0)).map((x) => (x/2));

 console.log(task1)

 const words = ["apple", "banana", "cherry"];
 let totalLength = 0;
 for (let i = 0; i < words.length; i++) {
     totalLength += words[i].length;
 }
 
 const task2 = words.reduce((length, x) => length + 1, 0);
 console.log(task2);

 const people = [
     {name: "Alice", age: 20},
     {name: "Bob", age: 15},
     {name: "Charlie", age: 30},
     {name: "David", age: 10},
 ];
 let firstChildName = undefined;
 for (let i = 0; i < people.length; i++) {
     if (people[i].age < 18) {
         firstChildName = people[i].name;
         break;
     }
 }

 console.log(firstChildName);

 const task3 = people.filter(person => person.age < 18)[0].name;
 console.log(task3)

 const people4 = [
     {name: "Alice", age: 20},
     {name: "Bob", age: 15},
     {name: "Charlie", age: 30},
     {name: "David", age: 10},
 ];
 let result4 = "";
 for (let i = 0; i < people4.length; i++) {
     result4 += `Person #${i + 1}: ${people4[i].name} is ${people4[i].age} years old`;
     if (i != people4.length - 1) {
         result4 += "\n";
     }
 }

console.log(result4);


people4.forEach((person, i) => console.log(`Person #${i + 1}: ${person.name} is ${person.age} years old`))

