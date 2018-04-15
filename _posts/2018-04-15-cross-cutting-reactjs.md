---
layout: post
title: "HOC vs Render Props"
date: 2018-04-15 12:00:12 +0000
permalink: /coding/hoc-vs-render-props
category: coding
published: false
meta_description: >
 Understand why and how to use render props with React JS 
excerpt_separator: <!--more-->
---

`React.createClass` mixins

The challenge of building reusable function for components

- ES6 classes. They don’t support mixins.
- Indirection. Mixins that modify state make it tricky to tell where that state is coming from, especially when there’s more than one mixin.
- Naming collisions. Two mixins that try to update the same piece of state may overwrite one another. The createClass API included a check that would warn you if two mixins had a getInitialState value with the same keys, but it wasn’t airtight.

https://reactjs.org/blog/2016/07/13/mixins-considered-harmful.html


HOC

- ES6 classes. Yep! No problems here. We can use HOCs with components created using ES6 classes.
- Indirection. We still have the same problem with indirection that we had when we were using mixins. Except this time instead of wondering where our state comes from we’re wondering which HOC provides which props.
- Naming collisions. Unfortunately we still have this problem too. Two HOCs that try to use the same prop name will collide and overwrite one another, except this time it’s slightly more insidious because React won’t warn us about the prop name collision.

Another problem that both mixins and HOCs share is that they use static composition instead of dynamic composition. Ask yourself: where is the composition happening in the HOC paradigm? Static composition happens once, when the component class is created (e.g. AppWithMouse in the previous example).

You don’t use mixins or HOCs in your render method, which is a key piece of React’s dynamic composition model. When you compose in render, you get to take advantage of the full React lifecycle.

So in summary: using a HOC with ES6 classes poses many of the same problems that mixins did with createClass, just re-arranged a bit.