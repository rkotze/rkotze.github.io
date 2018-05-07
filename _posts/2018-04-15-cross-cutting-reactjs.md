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

Back in the day using `React.createClass`, [**mixins**](https://github.com/facebook/react/blob/0.14-stable/docs/docs/05-reusable-components.md#mixins){:target="\_blank"}  was the way to share cross cutting concerns for components. It was decided to start using ES6 `class` to build React components to manage the state. However, `class` did not support mixins and a new way had to be developed.

What was wrong with mixins? 

- Two mixins could implement the same method and that would cause one to override the other. No warning would appear if this was the case either.
- Interesting thing is mixins can have their own mixins, creating protential for a deep tree of dependencies to jump through.
- Multiple mixins create lots of indirection making it difficult to identify which ones are modifing the state of the component.
- Mixins could be modifing the same state key creating a naming collision issue, with some warning.

Dan Abramov has written a post on why [mixins considered harmful](https://reactjs.org/blog/2016/07/13/mixins-considered-harmful.html){:target="\_blank"}.

Eventually HOC evolved into the picture using ES6 classes. What did they solve?

Here is my post on [understanding how higher-order components](/coding/understanding-higher-order-components) work.


HOC

- ES6 classes. Yep! No problems here. We can use HOCs with components created using ES6 classes.
- Indirection. We still have the same problem with indirection that we had when we were using mixins. Except this time instead of wondering where our state comes from we’re wondering which HOC provides which props.
- Naming collisions. Unfortunately we still have this problem too. Two HOCs that try to use the same prop name will collide and overwrite one another, except this time it’s slightly more insidious because React won’t warn us about the prop name collision.

Another problem that both mixins and HOCs share is that they use static composition instead of dynamic composition. Ask yourself: where is the composition happening in the HOC paradigm? Static composition happens once, when the component class is created (e.g. AppWithMouse in the previous example).

You don’t use mixins or HOCs in your render method, which is a key piece of React’s dynamic composition model. When you compose in render, you get to take advantage of the full React lifecycle.

So in summary: using a HOC with ES6 classes poses many of the same problems that mixins did with createClass, just re-arranged a bit.