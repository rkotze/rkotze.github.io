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

For an object to become an Iterable it needs to implement the minimum interface required, which is an object with a `next` method returning an object with the properties `value` and `done`. It must have the `[Symbol.iterator]` as well as this is key to using JavaScripts `for..of` loop.

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

Below is a `for..of` for the above iterator. Without the `[Symbol.iterator]` the for loop will not work. Copy and paste the code to try it out first hand.

```javascript
for(let number of iterator){
  console.log(number);
}
```

You're might be looking at this code example and thinking this looks pretty verbose and got some annoy boiler code. ES6 has some good syntax sugar to help make this all look clean. It's called generators:

Example below of a generator:

```javascript
function* firstGenerator() {
  let numberedArray = [1, 2];
  while(numberedArray.length){
    yield numberedArray.shift();
  }
}

let iteratorGen = {
  [Symbol.iterator]: firstGenerator
}

for(let number2 of iteratorGen) {
  console.log(number2);
}
```