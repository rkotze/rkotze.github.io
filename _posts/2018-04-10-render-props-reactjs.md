---
layout: post
title: "Understanding render props"
date: 2018-04-10 12:00:12 +0000
permalink: /coding/understanding-render-props-react-js
category: coding
published: false
meta_description: >
 Understand why and how to use render props with React JS 
excerpt_separator: <!--more-->
---

In this post I will discuss the why and how to use _render prop_ with [ReactJS](https://reactjs.org/).

**Why use render prop:** Promote _reuse_ of behaviour across React components.

This sounds similar to [higher-order components](/coding/understanding-higher-order-components), however we will focus on render props and discuss the differences in another post.

<!--more-->

**How to use render prop:** The value of a prop is assigned a function. This is called in the parent component and renders React elements. The parent component typically will handle data which is passed through the callback parameters.

**Example** of using a render prop:

```javascript
<FetchData render={(data) => {
  return <p>{data}</p>
}} />
```

The prop is called `render` and is assigned a `function` however this does not _need_ to be called `render` it could be called anything. Any prop on the component could be assigned a function including `this.props.children`.

**Example** of render props using a different prop:

```javascript
<FetchData>{(data) => {
  return <p>{data}</p>
}}</FetchData>
```

As you can see render props is ensuring the parent component knows what to render without having to code it directly into `FetchData` making it reusable. Building your own render props component to better understand the benefits.

## Building your own



Here is the [codepen.io example for fetching git contributors](https://codepen.io/rkotze/pen/oqqopQ){:target="\_blank"}