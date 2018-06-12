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

You might be looking at this code example and thinking it is pretty verbose and got some annoy boiler code. ES6 has some good syntax sugar to help make this all look clean.

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

The key features to defining a generator is `function*` and `yield`. Yield essentially pauses the execution of the next line until it is called again. In the above example you can see by calling the `firstGenerator` function we have access to `next` which returns value and iterator done state. This is the same as defining our `firstIterator`. Returning at then end of the function will set `done` to `true`. 

