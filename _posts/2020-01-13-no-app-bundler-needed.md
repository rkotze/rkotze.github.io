---
layout: post
title: "No app bundler needed for your next project?"
date: 2020-01-12 06:00:12 +0000
permalink: /coding/no-app-bundler-needed
category: coding
published: true
full_image_url: "https://user-images.githubusercontent.com/10452163/72224705-51eaa780-3575-11ea-8fcb-4aa0861595f6.jpg"
meta_description: >
  Exploring new language features supported in the browser without a bundler.
excerpt_separator: <!--more-->
tags: javascript
---

The browsers are rolling out updates to support more of the latest features of JavaScript defined by _ECMAScript_ [technical committee 39](https://github.com/tc39){:target="\_blank" rel="noopener"}. Have you thought about how much can we write today without using an app bundler like [Webpack](https://webpack.js.org/){:target="\_blank" rel="noopener"}, [Rollup.js](https://rollupjs.org/guide/en/){:target="\_blank" rel="noopener"} or [Parcel](https://parceljs.org/){:target="\_blank" rel="noopener"}? Below I will go through a few _JavaScript features_ we can use in today's modern web browser when building a new web app.

<!--more-->

![coffee mug with pinecones](https://user-images.githubusercontent.com/10452163/72224705-51eaa780-3575-11ea-8fcb-4aa0861595f6.jpg)
_Photo by Tetiana Shadrina on Unsplash_

Unsurprisingly, _Internet Explorer_ doesn't support many of these features, however, _Edge_ seems to do a decent job.

The idea behind this post is to begin to consider whether or not a bundler is really needed, because it has become the norm to use one for lots of JS apps. A bundler is an additional dependency which you may need to configure quite extensively to get the output you need, adding significant complexity before building any app features. I'm not saying we don't need them, but it could be possible to start a project without a bundler, and add it in at a later stage when you find the need. Perhaps you have a small enough project where it's not needed: perhaps a Chrome extension for example.

## New language features added in the browser

Below are a few new JavaScript features which will work in most modern browsers.

- `let` and `const` for declaring variables and [_destructuring assignment_](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment){:target="\_blank" rel="noopener"}.
- [Template literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals){:target="\_blank" rel="noopener"} are string literals allowing embedded expressions and can be multiline. `string literal ${expression}`
- [Rest/spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax){:target="\_blank" rel="noopener"} `...` take remaining values (rest) or apply key/values (spread) to an object or array.
- [Arrow function expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions){:target="\_blank" rel="noopener"} `() => {}`, is a more compact syntax than the normal function expression and does not have its own `this` but instead it uses the enclosing lexical scope.

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

You will be pleased to know that `async/await` is supported in the browser which will make using native `fetch` API even easier to work with.

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

With most applications you will want to separate your app into modules. Typically you will create a new file which will export an object or function that can be imported in another file. This means it would need to support a module system.

Modern browsers do support ECMAScript modules by adding a script tag with the `type="module"` and here are some points to note about this approach. See [module browser support](https://caniuse.com/#feat=es6-module){:target="\_blank" rel="noopener"}.

- Each module has its own scope which is not the global one
- Strict mode is always 'on', even when "use strict" directive is not provided
- The module may import other modules using _import directive_
- The module may export bindings using _export_

Another interesting attribute of a module script is it behaves like a `defer`ed script, in that is will not block the parsing of the HTML and execute after parsing has completed. In the example below you can see the script tag is in the head but our imported module will reference the `div` tag further along.

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

Read more details about [module script tag](https://hospodarets.com/native-ecmascript-modules-the-first-overview){:target="\_blank" rel="noopener"} here.

Potentially you could have a small project or start a new one without the need of a bundler. If you decide to not use a bundler, I'd like to hear what challenges you faced and what you tried to do to solve them? Let me know on [Twitter](https://twitter.com/share?text=No app bundler needed for your next project? by @richardkotze &url=https://www.richardkotze.com/coding/no-app-bundler-needed&hashtags=javascript,programming,coding){:target="\_blank" rel="noopener"}, or in the comments below.
