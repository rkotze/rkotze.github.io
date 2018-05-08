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

Eventually, HOC evolved into the picture to support code reuse. Essentially these are similar to the decorator pattern, a **function** that takes a **component** as the first parameter and returns a **function**. This is where you apply your cross cutting functionality. 

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

- Importantly they provided a way to reuse code using ES6 classes.
- No longer have method name clashing if two HOC implement the same one.
- It is easy to make small reusable units of code supporting single responsibility.
- Have mulitple HOC applied to one component using a compose function.

You can start to see similarities between _mixins_ and _HOC_ including mixins downsides:

- There is still an indirection issue, however, not about which HOC is changing the state but which one is providing a certain prop.
- It is possible two HOC could be using the same prop meaning there is still a naming collision issue.

Higher-order components also being in new problems as well.

- Boiler plate code like setting the `displayName` with the HOC function name e.g. (`withHOC(Component)`)
- Pass props through
- Hoist static methods from the wrapped component.


HOC

- ES6 classes. Yep! No problems here. We can use HOCs with components created using ES6 classes.
- Indirection. We still have the same problem with indirection that we had when we were using mixins. Except this time instead of wondering where our state comes from we’re wondering which HOC provides which props.
- Naming collisions. Unfortunately we still have this problem too. Two HOCs that try to use the same prop name will collide and overwrite one another, except this time it’s slightly more insidious because React won’t warn us about the prop name collision.

Another problem that both mixins and HOCs share is that they use static composition instead of dynamic composition. Ask yourself: where is the composition happening in the HOC paradigm? Static composition happens once, when the component class is created (e.g. AppWithMouse in the previous example).

You don’t use mixins or HOCs in your render method, which is a key piece of React’s dynamic composition model. When you compose in render, you get to take advantage of the full React lifecycle.

So in summary: using a HOC with ES6 classes poses many of the same problems that mixins did with createClass, just re-arranged a bit.