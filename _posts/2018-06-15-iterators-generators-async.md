---
layout: post
title: "Async iterators in JavaScript"
date: 2018-06-15 12:00:12 +0000
permalink: /coding/async-iterators-in-javascript
category: coding
published: false
image: street-art.jpg
meta_description: >
 Async iterators in JavaScript 
excerpt_separator: <!--more-->
---

For an object to become an iterator it needs to know how to access values in a collection and keeping track of its position in the list. This is achieved by an object implementing a `next` method and returning the next value in the sequence. This method should return an object containing two properties `value` and `done`. It must have the `[Symbol.iterator]` as well as this is key to using JavaScripts `for..of` loop.

Example of defining an iterator

```javascript
function firstIterator(){
  let numberedArray = [1, 2];
  return {
    next: function() {
      if (numberedArray.length) {
        return {
          value: numberedArray.shift(),
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
  [Symbol.iterator] : firstIterator
}
```

Below is a `for..of` using the above iterator. Without the `[Symbol.iterator]` the for loop will not work. Copy and paste the code to try it out.

```javascript
for(let number of iterator){
  console.log(number);
}
```

You might be looking at this code example and thinking it is pretty verbose and got some annoy boiler code. ES6 has delightful syntax sugar to help make this all look clean.

Example below of a generator:

```javascript
function* firstGenerator() {
  let numberedArray = [1, 2];
  while(numberedArray.length){
    yield numberedArray.shift();
  }
}

console.log(firstGenerator().next()) // { value: 1, done: false }

let iteratorGen = {
  [Symbol.iterator]: firstGenerator
}

for(let number2 of iteratorGen) {
  console.log(number2);
}
// -> 1, 2
```

The key features to defining a generator is `function*` and `yield`. Yield essentially pauses the execution when it is reached until the `next` method is called. In the above example you can see by calling the `firstGenerator` function we have access to `next` method which returns `value` and iterator `done` state. This is the same as defining our `firstIterator` except its more concise and easy to read.

_I feel_ the asterisk makes this a bit awkward, in terms for remembering to use it and its position on the function keyword. This is probably because it's new syntax and we will eventually get use to it.

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

In the above example you can see `return` ends the generator and sets the state to done. Anything after that is not reached.

Delegate to another generator.

Pass parameters to a generator.

It is not possible to `new` a generator and in ES7 this will throw an error if `new` is used.