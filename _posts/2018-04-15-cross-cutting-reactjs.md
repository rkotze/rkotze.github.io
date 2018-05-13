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

Higher-order components (<abbr title="higher-order component">HOC</abbr>) and Render props are two ways to build cross cutting code in React JS. _How do you decide to use one of the other?_ This is the question I will attempt to answer.

<!--more-->

Back in the day using `React.createClass`, [**mixins**](https://github.com/facebook/react/blob/0.14-stable/docs/docs/05-reusable-components.md#mixins){:target="\_blank"}  was the way to share cross cutting concerns for components. Since the next version of JavaScript, ES6 was on the way the decision was made to use `class` for building React components to manage the state. However, `class` did not support mixins and a new way had to be developed.

What was wrong with mixins? 

- Two mixins could implement the same method and that would cause one to override the other. No warning would appear if this was the case either.
- Interesting thing is mixins can have their own mixins, creating protential for a deep tree of dependencies that would make debugging difficult.
- Multiple mixins create lots of indirection making it difficult to identify which ones are modifing the state of the component.

For more details Dan Abramov wrote a post on why [mixins considered harmful](https://reactjs.org/blog/2016/07/13/mixins-considered-harmful.html){:target="\_blank"}.

## Higher-order components

Soon HOC evolved into the picture to support code reuse. Essentially these are similar to the decorator pattern, a **function** that takes a **component** as the first parameter and returns a **function**. This is where you apply your cross cutting functionality.

**Example** Higher-order components

```jsx
function withExample(Component) {
  return function(props) {
    // cross cutting logic added here
    return <Component {...props} />;
  };
}
```

Read my post on [understanding how higher-order components](/coding/understanding-higher-order-components) to learn more.

What do HOC solve?

- Importantly they provided a way to reuse code when using ES6 classes.
- No longer have method name clashing if two HOC implement the same one.
- It is easy to make small reusable units of code supporting single responsibility.
- Have multiple HOC applied to one component, using a compose function for better readability.

You can start to see similarities between _mixins_ and _HOC_ including mixins downsides:

- There is still an indirection issue, however, not about which HOC is changing the state but which one is providing a certain prop.
- It is possible two HOC could be using the same prop meaning there is still a naming collision issue.

Higher-order components come with new problems:

- Boiler plate code like setting the `displayName` with the HOC function name e.g. (`withHOC(Component)`) to help with debugging.
- Ensure all relevant props are passed through to the component.
- Hoist static methods from the wrapped component.

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

From this we can generally say Render Props solves the issues identified posed by HOC and in my opinion your go to to create cross cutting logic is Render Props. Because they are easier to construct since they are similar to standard components and callback functions are common place making it relatively easy to understand.

However, I would not dismiss HOC because of this. HOC is statically composed where as Render Props are dynamically composed. Each coming with their own pros and cons. 

-----

Another problem that both mixins and HOCs share is that they use static composition instead of dynamic composition. Ask yourself: where is the composition happening in the HOC paradigm? Static composition happens once, when the component class is created (e.g. AppWithMouse in the previous example).

You don’t use mixins or HOCs in your render method, which is a key piece of React’s dynamic composition model. When you compose in render, you get to take advantage of the full React lifecycle.

So in summary: using a HOC with ES6 classes poses many of the same problems that mixins did with createClass, just re-arranged a bit.