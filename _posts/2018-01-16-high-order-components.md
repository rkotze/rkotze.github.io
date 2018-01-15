---
layout: post
published: false
title:  "Understanding high order components"
date:   2018-01-16 12:00:12 +0000
permalink: /coding/understanding-high-order-components
category: coding
meta_description: >
 Understand why and how to use high order components in React JS 
excerpt_separator: <!--more-->
---

In this post I will discuss the why and how to use high order components (<abbr title="High Order Component">HOC</abbr>) in ReactJS.
It will also cover examples and conventions.

**Why use HOC:** Promote reuse of logic across React components.

Components are the typical element for reuse in React but sometimes features don't fit into this standard. There might be exact same methods used to fetch data but the display is different. See example 1 below.

<!--more-->

**How to use HOC:** The core structure of a HOC is a function that takes a _component_ and returns a _new component_. HOC are pure functions with no side-effect because the component passed is wrapped in a new component. Typically data is passed in as props and additional props are passed through.

This is a general compositional pattern and not part of React as such.

## Examples of High order components

First will show the repeated data fetching and how we can transform it into a HOC.

{% highlight javascript %}

{% endhighlight %}
_Example 1_
