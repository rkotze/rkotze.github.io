---
layout: post
title: "Idea/Draft posts"
date: 2020-01-04 06:00:12 +0000
permalink: /ideas
category: coding
excerpt_separator: <!--more-->
---

See all the ideas.

<!--more-->

# Web services

# Quirks of modern javascript

# Dockerise create react app run on windows

# How to make a chrome extension 

# Build a web app without the need for a bundler

The browsers are rolling out updates to support more of the latest features of JavaScript defined by _ECMAScript_ [technical committee 39](https://github.com/tc39). Have you thought about how much can we write today without using an app bundler like [Webpack](https://webpack.js.org/), [Rollup.js](https://rollupjs.org/guide/en/) or [Parcel](https://parceljs.org/)? Below I will go through a few _JavaScript features_ we can use in today's modern web browser for when you build a new web app.

It may not be a surprise but a lot of the features are not supported by Internet Explorer but _Edge_ seems to do a decent job.

The idea behind this post is to start considering the need for a bundler, because it has become the norm to use one for lots of JS apps. A bundler is an additional dependency which you may need to configure quite extensively to get the output you need adding significant complexity before building any app features. I'm not saying we don't need them but it could be possible to start a project without it and add it in at a later stage when you find the need it. Perhaps you have a small enough project where its not needed, perhaps a Chrome extension for example.

## New language features

Below are a few new JavaScript features which will work in most modern browsers.

- `let` and `const` for declaring variables and [_destructuring assignment_](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment).
- [Template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals) are string literals allowing embedded expressions and can be multiline. `string literal ${expression}`
- [Rest/spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax) `...` take remaining values (rest) or apply key/values (spread) to an object or array.
- [Arrow function expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions) `() => {}`, is a more compact syntax than the normal function expression and does not have its own `this` but instead it uses the enclosing lexical scope.

### Examples

```javascript
const letters = ["a", "b", "c", "d", "e"];
const starter = {
  hello: "hello",
  world: "world"
};

const [a, b, ...rest] = letters;
console.log(a, b); // => a b
console.log(rest); // => ["c", "d", "e"]
const spread = rest;
const numsLetters = [1, 2, ...spread];
console.log(numsLetters); // => [1, 2, "c", "d", "e"]

const { hello } = starter;
console.log(hello); // => hello

let count = 1;
count += 5;
console.log(count) // => 6

console.log(`Template literals ${starter.world}`) // => Template literals world

const arrowLog = (message) => console.log(`->: ${message}`)
arrowLog("point"); // => ->: point
```

## Async/Await and making HTTP requests

You will pleased to know that `async/await` is supported in the browser which will make using native `fetch` API even easier to work with.

```javascript
async function getRecipe() {
  const res = await fetch(
    "https://api.github.com/search/repositories?q=tetris+language:assembly&sort=stars&order=desc"
  );
  const data = await res.json();
  console.log(data);
  return data;
}

```

## JavaScript modules and organising your app files

With most applications you will want to separate your app into modules. Typically you will create a new file which will export an object or function which can then be imported in the main file for example. This means it would need to support a module system.

Modern browsers do support ECMAScript modules by adding a script tag with the `type="module"` and here are some points to note about this approach. See [module browser support](https://caniuse.com/#feat=es6-module).

- Each module has own scope which is not the global one
- They are always in strict mode, even when "use strict" directive is not provided
- The module may import other modules using import directive
- The module may export bindings using export

Another interesting attribute of a module script is it behaves like a `defer`ed script, in that is will not block the parsing of the HTML and execute after parsing has completed. In the example below you can see the script tag is in the head but our imported module will reference the `div` tag further down the file.

### Example use of module script tag

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script type="module" src="./index.js"></script>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

```javascript
// index.js
import { startApp } from "./todo-app.js";

startApp();
```

```javascript
// todo-app.js
export function startApp() {
  const appBox = document.getElementById("app");

  appBox.innerHTML += "I was imported";
}
```

It is also possible to do an inline import, see below:

```html
<script type="module">
  import { startApp } from "./todo-app.js";

  startApp();
</script>
```

Read more details about [module script tag](https://hospodarets.com/native-ecmascript-modules-the-first-overview) here.

Potentially you could have a small project or start a new one without the need of a bundler. If you decide to not use a bundler, I'd like to hear what challenges you faced and what you tried to solve them? Let me know on Twitter or in the comments below.

# Graphql server validation errors

Make it part of the mutation payload object.

# Consistent complexity scoring

In your team you are flexible on pair programming and generally decide that we will pair if someone needs help or the work is complex. This causes an issue with items piling up in review because the easy items move quickly to review and the engineer decides to start a new work, but they take on another easy task that skips over to review fairly soon while the other pair on a complex issue. When the complex task moves over to review finally the pair is free to review the small items.

The pair working on the complex issue could review items immediately but this comes at the cost of losing your line of thought to solving the issue they were working on. It will become frustrating if more things move to review quickly.

If there is feedback for code changes then the engineer starting a new task needs to address those, this means one item in the flow is not being worked on. Typically things nearest to done are of higher priority, so best to stop what is in progress but this will mean another costly context switch as well.

Then the person soloing goes on annual leave with work in progress and the other team members are not sure where they left off.

How can we mitigate these issues?

- Be strict on pairing, so pair on the simple tasks.
- Limit the WIP to the number of pairs you have for the day.
- I recommend that each work item is similar in complexing to each other. This should help with getting items into review in a similar time frame.

* You could agree that pairing on simple tasks means it could skip review.

* Opinion on the value of limiting WIP to the number of pairs you have
* The danger of having doing simple tasks solo
* The challenge of reviewing code #honest

# Azure pipeline thoughts

### Why have a delivery pipeline?

Generally a delivery pipeline gives you confidence that your app is functioning as you expect it and preventing regression. Including a delivery step will help reduce the over head of remembering the commands to run to release into production. However, there is a lot more about the importance of having a pipeline, you can read more from my post on [CI and continuous delivery (CD)](/continuous-integration-delivery-deployment)

### What I like Azure pipeline

As far as Azure pipelines are concerned I thought it would be worth trying to see how well it worked and the benefits of using it.

- It's free and you get a lot of good features for the free tier
- You can provide a configured yaml file which manages a good variety of steps. This allows you to version control your pipeline, which is always handy.
- The pipeline UI is clean and simple to navigate
- You can construct the pipeline in the UI with a load of predefined tasks then copy the yaml out to your project.
- I found the pipeline configuration really flexible which in a way is good/bad
- Lots of documentation about specific features and a few get started tutorials which I found handy.
