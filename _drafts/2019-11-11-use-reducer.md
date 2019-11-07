---
layout: post
title: "Complex state managed with React hook useReducer"
date: 2019-11-07 06:00:12 +0000
permalink: /coding/react-hooks-usereducer-context
category: coding
full_image_url: https://user-images.githubusercontent.com/10452163/67992561-2a05cc00-fc35-11e9-916d-c7fbf8c1dc78.jpg
meta_description: >
  Manage complex state in React for a feature which has many nested child components.
excerpt_separator: <!--more-->
---

This post will cover managing complex state at a feature level rather than the entire site. [**React hooks**](https://reactjs.org/docs/hooks-intro.html){:target="\_blank" rel="noopener"} have enabled us to have cleaner functional components which enable us to rationalise our component logic with easy.

Take `useState` hook, it's one line of code which then can be used to manage the state of a component rather than having to create a `class` that comes with boiler code. This is great because we are keeping simple things simple!

However, there are features which are inherently complex as they have many nested child components which need to alter the state of the component.

**What options** are there to manage this complexity?

<!--more-->

Generally is good practice to **keep it simple**, which might lead you down the path of passing the `setState` function down the stack of components. The downside here is the mutation of state can become difficult to follow, as in how does four actions affect state. Another thing to consider is how easy is it to test state change to test. Do you want to render components and click those actions to assert how state has changed?
