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

Async iterators will enable JavaScript engineers to read steams like fetching data from a web service. It introduces a new for loop called `for-await-of` which is similar to the sync iterator `for-of` loop.

```javascript
async function f() {
    for await (const x of createAsyncIterable(['a', 'b'])) {
        console.log(x);
    }
}
```
