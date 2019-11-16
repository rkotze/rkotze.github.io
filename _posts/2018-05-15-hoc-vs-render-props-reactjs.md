---
layout: post
title: "Higher-order components vs Render Props"
date: 2018-05-15 12:00:12 +0000
permalink: /coding/hoc-vs-render-props-react
category: coding
published: true
image: "colour-star-sky.jpg"
meta_description: >
 Decide when to use higher-order component over Render props.
excerpt_separator: <!--more-->
tags: javascript react
---

Higher-order components (<abbr title="higher-order component">HOC</abbr>) and render props are two ways to build cross cutting code in React JS. _How do you decide to use one over the other?_

<!--more-->

The reason we have these two approaches is that React decided to use ES6 `class` for building React components to manage state. Before that, to share [cross-cutting concerns](https://stackoverflow.com/questions/23700540/cross-cutting-concern-example){:target="\_blank"} for components `React.createClass` [**mixins**](https://github.com/facebook/react/blob/0.14-stable/docs/docs/05-reusable-components.md#mixins){:target="\_blank"} was the way to handle that. However, `class` does **not** support mixins and a new way had to be developed.

For more details, Dan Abramov wrote a post on why [mixins are considered harmful](https://reactjs.org/blog/2016/07/13/mixins-considered-harmful.html){:target="\_blank"}.

![Colourful starry night](/images/colour-star-sky.jpg)
_Photo by Kristopher Roller on Unsplash_

## Higher-order components

Soon HOC evolved into the picture to support code reuse. Essentially these are similar to the decorator pattern, a **function** that takes a **component** as the first parameter and returns a **new component**. This is where you apply your crosscutting functionality.

**Example** of higher-order component:

```jsx
function withExample(Component) {
  return function(props) {
    // cross cutting logic added here
    return <Component {...props} />;
  };
}
```

To find out more, read my post on [understanding higher-order components](/coding/understanding-higher-order-components).

What does HOC solve?

* Importantly they provided a way to reuse code when using ES6 classes.
* No longer have method name clashing if two HOC implement the same one.
* It is easy to make small reusable units of code, thereby supporting the single responsibility principle.
* Apply multiple HOCs to one component by _composing_ them. The readability can be improve using a [compose function](https://github.com/acdlite/recompose#composition){:target="\_blank"} like in Recompose.

You can start to see similarities in the downsides for both _mixins_ and _HOC_:

* There is still an indirection issue, however, not about which HOC is changing the state but which one is providing a certain prop.
* It is possible two HOC could be using the same prop meaning one would overwrite the other silently.

Higher-order components come with new problems:

* Boilerplate code like setting the `displayName` with the HOC function name e.g. (`withHOC(Component)`) to help with debugging.
* Ensure all relevant props are passed through to the component.
* Hoist static methods from the wrapped component.
* It is easy to compose several HOCs together and then this creates a deeply nested tree making it difficult to debug.

## Render Props

A render prop is where a component's prop is **assigned a function** and this is called in the render method of the component. Calling the function can return a React element or component to render.

**Example** of using a render prop:

```jsx
render(){
  <FetchData render={(data) => {
    return <p>{data}</p>
  }} />
}
```

Read my post to [understand more about render props](/coding/understanding-render-props-react-js).

What do render props solve?

* Reuse code across components when using ES6 classes.
* The lowest level of indirection - it's clear which component is called and the state is isolated.
* No naming collision issues for props, state and class methods.
* No need to deal with boiler code and hoisting static methods.

Minor problems:

* Caution using `shouldComponentUpdate` as the render prop might close over data it is unaware of.
* There could also be minor memory issues when defining a closure for every render. But be sure to measure first before making performance changes as it might not be an issue for your app.
* Another small annoyance is the render props callback is not so neat in JSX as it needs to be wrapped in an expression. Rendering the result of an HOC does look cleaner.

## HOC or render props

From this, we can generally say **render props** solves the issues posed by HOC, and in my opinion, it should be your go-to pattern for creating cross-cutting logic. Render props are easier to set up, with less boiler code and no need to hoist static methods, as they are similar to standard components. They are also more predictable as fewer things can go wrong with updating state and passing props through.

However, I find **HOC better to compose** over render props, especially when many cross-cutting concerns are applied to a component. Many nested render prop components will look similar to "callback hell", as highlighted by Andrew Clark on Twitter. It's straightforward to create small HOC units and compose them together to build a feature-rich component. [Recompose](https://github.com/acdlite/recompose){:target="\_blank"} is a great example and can be useful to apply to solving your next challenge.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">But they are! I’ve been working on demos of unreleased React features and all my components are 10 callbacks deep. Super powerful but a PITA to compose more than two or theee. There’s gotta be some way we can make it nicer.<br><br>Render props : callbacks :: async/await : ???</p>&mdash; Andrew Clark (@acdlite) <a href="https://twitter.com/acdlite/status/955954032194895872?ref_src=twsrc%5Etfw">January 24, 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Just remember to use the tool that best helps you solve your problem and don't let the Hype Driven Development pressure you to do otherwise. Render props and HOC are equally great React patterns.
