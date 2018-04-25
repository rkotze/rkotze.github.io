---
layout: post
title: "Working with promises and async/await"
date: 2018-04-15 12:00:12 +0000
permalink: /coding/promises-and-async-await
category: coding
published: false
meta_description: >
 Learn about ES7 async and await 
excerpt_separator: <!--more-->
---

This post is going to give you lots of code examples of **promises** and _ES7_ **async/await**.

<!--more-->

What do promises solve in our code?

Whenever you wanted to resolve some data which needed to be fetched asynchronously it has to be done via a callback. What this led to in complex applications is known as "callback hell", when the first data fetch was resolved another data fetch needs to happen after. This would repeat a few times, creating a "nice" sideways pyramid in your code.

Example of **callback hell**:

```javascript
function resolveMyTurtles(callback) {
  turtleA('/a', function(someDatas) {
    turtleB('/b', function(moreDatas) {
      turtleC('/c', function(megaDatas) {
        callback(megaDatas);
      });
    });
  });
}
```

Pretty difficult to read this code and this is without the need to handle errors. Which would double the lines of code and its complexity. Naturally, this would be retrospectively unit tested, but you might not want to take that challenge on.

Now using **promises**:

```javascript
function resolveMyTurtles() {
  return turtleA('/a');
  .then(function(someDatas) {
    return turtleB('/b');
  })
  .then(function(moreDatas){
    return turtleC('/c');
  });
}
```

Now using **async/await**:

```javascript
async function resolveMyTurtles() {
  await turtleA('/a');
  await turtleB('/b');
  return await turtleC('/c');
}
```