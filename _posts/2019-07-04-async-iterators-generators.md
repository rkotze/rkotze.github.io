---
layout: post
title: "Async Iterators and Generators in JavaScript"
date: 2018-07-04 12:00:12 +0000
permalink: /coding/async-iterators-generators-javascript
category: coding
published: false
image: fish-street-art.jpg
meta_description: >
 Useful examples of using async iterators and generators in ES6 JavaScript 
excerpt_separator: <!--more-->
---

Async iterators will enable JavaScript engineers to read steams like lines of text from a web service or a file. It will be worth [understanding sync iterators](/coding/iterators-generators-es6-javascript) first in a previous post I wrote before reading this. 

It may seem plausible for a `for-of` loop to iterate through lines in a file but ultimately it can't execute until it has received the whole contents.

```javascript
for (const line of fetchFile(fileName)) {
    console.log(line);
}
```

<!--more-->

A new protocol has been added `[Symbol.asyncIterator]` to enable asynchronous iteration and the `next()` method return a promise. On the face of it an _iterator_ looks similar to an _async iterator_ except a _promise_ is returned requiring us to use `then` method to access the `value` and `done` state. See the example below:

```javascript
const { value, done } = syncIterator.next();

asyncIterator.next().then((data) => {
    console.log(data); // {value: 'a'  done: false}
    return asyncIterator.next();
}).then((data) => {
    console.log(data); // {value: 'b'  done: false}
    return asyncIterator.next();
}).then((data) => {
    console.log(data); // {value: undefined  done: true}
});
```

You can of course use `async/await` to read the data from the stream to make it cleaner, see below:

```javascript
async function readData(asyncIterator){
    console.log(await asyncIterator.next()); // {value: 'a'  done: false}
    console.log(await asyncIterator.next()); // {value: 'b'  done: false}
    console.log(await asyncIterator.next()); // {value: undefined  done: true}
}
```

A new for loop called `for-await-of` is also being introduced which is similar to the sync iterator `for-of` loop. This can only be used within `async` functions as defined by the ECMAScript specification. See example below:

```javascript
async function printFile() {
    for await (const lineX of readFile('x.file')) {
        console.log(lineX);
    }
}
```

If you're a bit confused I've written a post about [`async/await` and promises](/coding/promises-async-await-testing).

## Async generator around Fetch API

Async iterators enable you to read streams in the browser. For example using `fetch` the `response.body` is a [`ReadableStream`](https://streams.spec.whatwg.org/){:target="\_blank"} which can be iterated over. To show the chunked responses the `next` method is called directly. See below for getting React contributors from GitHub.

```javascript
async function* streamContributors(repoPath) {  
  let response = await fetch(`https://api.github.com/repos/${repoPath}/stats/contributors`);
  const reader = response.body.getReader();
  
  try {
    while (true) {
      
      const {done, value} = await reader.read();
      
      if (done) return;
      
      yield value;
    }
  }
  finally {
    reader.releaseLock();
  }
}

const reactContributors = streamContributors('facebook/react');

reactContributors.next().then((data) => {
  console.log('output1: ', new TextDecoder("utf-8").decode(data.value));
});

reactContributors.next().then((data) => {
  console.log('output2: ', new TextDecoder("utf-8").decode(data.value));
});
```

Defining an async generator is similar to a generator except it has async at the start, `async function* streamContributors`. We await on the fetch to resolve the response. Then the body is accessible and a reader is created and locked by calling `body.getReader()`. In a `try/catch` an infinite loop is used to continually read data however, `yield` will pause the loop until the `next` method is called. Once done reading the steam, the loop is exited and the `finally` block is hit to release the stream. This has to be done because once a reader is locked another one cannot be created until the current one is released. 

References:

- [Proposal async iteration](https://github.com/tc39/proposal-async-iteration){:target="\_blank"}