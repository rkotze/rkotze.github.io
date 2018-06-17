---
layout: post
title: "Iterators and Generators in ES6 JavaScript"
date: 2018-06-17 12:00:12 +0000
permalink: /coding/iterators-generators-es6-javascript
category: coding
published: true
image: fish-street-art.jpg
meta_description: >
 Lots of examples of using iterators and generators in ES6 JavaScript 
excerpt_separator: <!--more-->
---

For an object to become an iterator it needs to know how to access values in a collection and keeping track of its position in the list. This is achieved by an object implementing a `next` method and returning the next value in the sequence. This method should return an object containing two properties `value` and `done`. It must have the `[Symbol.iterator]` as well as this is key to using JavaScripts `for..of` loop.

<!--more-->

![Street art of cartoon fish](/images/fish-street-art.jpg)
_Photo by Sunyu on Unsplash_

## Build your first iterator

```javascript
function tenMultiplesOfThree(){
  let start = 1;
  const multiple = 3;
  return {
    next: function() {
      if (start <= 10) {
        const product = multiple * start;
        start++;       
        return {
          value: product,
          done: false
        };
      }
      
      return {
        done: true
      };
    }
  };
}

let iterator = {
  [Symbol.iterator] : tenMultiplesOfThree
}
```

Below is a `for..of` using the above iterator. Without the `[Symbol.iterator]` the for loop will not work.

```javascript
for(let number of iterator){
  console.log(number);
}
// -> 3, 6, 9, 12, 15, 18, 21, 24, 27, 30
```

### Built-in iterators

`String`, `Array`, `TypedArray`, `Map` and `Set` implement the Symbol.iterator method on their prototype. It is also possible to iterate a collection of DOM elements like a `NodeList`.

```javascript
for(let letter of "abc") {
  console.log(letter);
}
// -> "a" "b" "c"
``` 

## Generators

You might be looking at the first code example and thinking it is pretty verbose and got some boiler code. ES6 has got some syntax sugar to help make this all look clean and succinct.

An example below of a generator:

```javascript
function* firstTenMultiples(multiple = 3) {
  let start = 1;
  while(start <= 10){
    yield multiple * start;
    start++;
  }
}

console.log(firstTenMultiples().next());

let iteratorGen = {
  [Symbol.iterator]: firstTenMultiples
}

for(let number of iteratorGen) {
  console.log(number);
}
// -> 3, 6, 9, 12, 15, 18, 21, 24, 27, 30
```

The key features to defining a _generator_ are `function*`. Yield essentially pauses the execution of the function body when it is reached until the next call is made. In the above example you can see by calling the `firstTenMultiples` function we have access to `next` method which returns `value` and iterator state `done`. This is the same as defining our own iterator except its more concise and easy to read.

_I feel_ the asterisk makes this a bit awkward, in terms of remembering to use it and its position on `function`. I'm sure this is new syntax we will get used to.

```javascript
function* firstTenMultiples(multiple = 3) {
  let start = 1;
  while(start <= 10){
    yield multiple * start;
    start++;
  }
}

let multiplesOfFour = firstTenMultiples(4);

for(let number of multiplesOfFour) {
  console.log(number);
}
// -> 4, 8, 12, 16, 20, 24, 28, 32, 36, 40
```

From the above you can see I did not need to assign the generator function to `[Symbol.iterator]` for `for..of` loop to work. Inspecting the called result of `firstTenMultiples(4)` you can see on the `__proto__` it does have `[Symbol.iterator]` implemented. This confirms calling a **generator function** returns a **generator object** which is _iterable_.

### Generator finished

```javascript
function* returnExample(){
  yield "hello";
  return "world";
  yield "not reached"
}
const gen = returnExample();
console.log(gen.next()) // => { value: "hello", done: false }
console.log(gen.next()) // => { value: "world", done: true }
console.log(gen.next()) // => { value: undefined, done: true }
```

In the above example `return` ends the generator and sets the done state to true. Anything after that is not reached.

### Delegate to another generator

```javascript
function* countToThree(){
  yield 1;
  yield 2;
  yield 3;
}

function* firstTenMultiples(multiple = 3) {
  let start = 1;
  yield* countToThree();
  while(start <= 10){
    yield multiple * start;
    start++;
  }
}

let multiplesOfFour = firstTenMultiples(4);

for(let number of multiplesOfFour) {
  console.log(number);
}
// -> 1, 2, 3, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40
```

In the above example `firstTenMultiples` uses `yield*` to _delegate_ to `countToThree` generator function. This result in listing one to three first then multiples of four.

### Pass in a value via `next()` method

```javascript
function* firstTenMultiples(multiple = 3) {
  let start = 1;
  while(start <= 10){
    let reset = yield multiple * start;
    start++;
    if(reset) start = 1;
  }
}

let multiplesOfFour = firstTenMultiples(4);

console.log(multiplesOfFour.next().value); // 4
console.log(multiplesOfFour.next().value); // 8
console.log(multiplesOfFour.next().value); // 12
console.log(multiplesOfFour.next(true).value); // 4 (reset to start from beginning)
console.log(multiplesOfFour.next().value); // 8
console.log(multiplesOfFour.next().value); // 12
```

In the above example, the first parameter is used to reset the generator to start from the beginning. The last `yield` expression which paused the generator will use the parameter value as the result. Assigning `yield` to the variable `reset`, the value is `undefined` until a parameter is passed in, causing `reset` value to become `true` in this case.

### Destructing values from iterator

```javascript
const [a, b, c] = firstTenMultiples(5);
// -> a = 5, b = 10, c = 15
```

### Spread values from iterator

```javascript
const multiplesOfSix = [...firstTenMultiples(6)];
// -> [6, 12, 18, 24, 30, 36, 42, 48, 54, 60]
```

Hopefully, you find all these examples useful to getting started with iterators and generators.

References:

- [function\*](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function*){:target="\_blank"}
- [for..of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of){:target="\_blank"}
- [Iterators and generators](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators){:target="\_blank"}