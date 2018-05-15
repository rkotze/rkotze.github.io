---
layout: post
title: "HOC vs Render Props"
date: 2018-05-08 12:00:12 +0000
permalink: /coding/hoc-vs-render-props
category: coding
published: false
meta_description: >
 Decide when to use higher-order component over Render props.
excerpt_separator: <!--more-->
---

Higher-order components (<abbr title="higher-order component">HOC</abbr>) and Render props are two ways to build cross cutting code in React JS. _How do you decide to use one over the other?_

<!--more-->

There reason we have these two approaches is because React decided to use ES6 `class` for building React components to manage the state. Before that, to share cross cutting concerns for components `React.createClass` [**mixins**](https://github.com/facebook/react/blob/0.14-stable/docs/docs/05-reusable-components.md#mixins){:target="\_blank"} was the way to handle that. However, `class` does **not** support mixins and a new way had to be developed.

For more details, Dan Abramov wrote a post on why [mixins considered harmful](https://reactjs.org/blog/2016/07/13/mixins-considered-harmful.html){:target="\_blank"}.

## Higher-order components

Soon HOC evolved into the picture to support code reuse. Essentially these are similar to the decorator pattern, a **function** that takes a **component** as the first parameter and returns a **function**. This is where you apply your cross cutting functionality.

**Example** of Higher-order components

```jsx
function withExample(Component) {
  return function(props) {
    // cross cutting logic added here
    return <Component {...props} />;
  };
}
```

To find out more read my post on [understanding how higher-order components](/coding/understanding-higher-order-components).

What do HOC solve?

- Importantly they provided a way to reuse code when using ES6 classes.
- No longer have method name clashing if two HOC implement the same one.
- It is easy to make small reusable units of code supporting single responsibility principle.
- Have multiple HOC applied to one component, using a compose function for better readability.

You can start to see similarities downsides between _mixins_ and _HOC_:

- There is still an indirection issue, however, not about which HOC is changing the state but which one is providing a certain prop.
- It is possible two HOC could be using the same prop meaning one would overwrite the other silently.

Higher-order components come with new problems:

- Boiler plate code like setting the `displayName` with the HOC function name e.g. (`withHOC(Component)`) to help with debugging.
- Ensure all relevant props are passed through to the component.
- Hoist static methods from the wrapped component.
- It is easy to compose several HOCs together and then this creates a deeply nested tree making it difficult to debug.

## Render Props

A render prop is where a component's prop is **assigned a function** and this is called in the render method of the component. Calling the function can return React element or component to render.

**Example** of using a Render Props:

```jsx
render(){
  <FetchData render={(data) => {
    return <p>{data}</p>
  }} />
}
```

Read my post to [understand more about render props](/coding/understanding-render-props-react-js).

What do render props solve?

- Reuse code across components when using ES6 classes.
- Lowest level of indirection as it's clear which component is called and the state is isolated.
- No naming collision issues for props, state and class methods.
- No need to deal with boiler code and hoisting static methods.

Minor problems:

- Caution using `shouldComponentUpdate` as the Render prop might close over data it is unaware of.
- There could also be minor memory issues when defining a closure for every render. But be sure to measure first before making performance changes as it might not be an issue for you app.
- Another small annoyance is the Render Props callback is not so neat in JSX as it needs to be wrapped in an expression. Constructing a HOC and rendering that does look cleaner.

From this we can generally say Render Props solves the issues posed by HOC and in my opinion it should be your go pattern to creating cross cutting logic. They are easier to setup with less boiler code and hoisting static methods this is because are similar to standard components. They are more prodictable as less things can go wrong with updating state and passing props through.

However, I would not dismiss HOC because of this. HOC is statically composed where as Render Props are dynamically composed. Each coming with their own pros and cons. 

https://news.ycombinator.com/item?id=15651808

-----

Another problem that both mixins and HOCs share is that they use static composition instead of dynamic composition. Ask yourself: where is the composition happening in the HOC paradigm? Static composition happens once, when the component class is created (e.g. AppWithMouse in the previous example).

You don’t use mixins or HOCs in your render method, which is a key piece of React’s dynamic composition model. When you compose in render, you get to take advantage of the full React lifecycle.

So in summary: using a HOC with ES6 classes poses many of the same problems that mixins did with createClass, just re-arranged a bit.