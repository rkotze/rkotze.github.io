---
layout: post
title:  "Should-enzyme: Useful functions for testing React Components with Enzyme"
date:   2017-01-24 17:00:12 +0000
permalink: /projects/should-enzyme
category: projects
meta_description: >
 Useful set of functions that extends ShouldJS and wrappers Enzyme. 
excerpt_separator: <!--more-->
---

**What is should-enzyme:** An library of extension functions for [ShouldJS](https://shouldjs.github.io/) and a wrapper round [Enzyme](https://github.com/airbnb/enzyme).

**Why use it:** Make it easier to test ReactJS components, improve readability of asserts and provide better error messaging on failing tests.

[Should-Enzyme](https://github.com/rkotze/should-enzyme){:target="_blank" rel="noopener"} API in the read me on Github and is an [NPM package](https://www.npmjs.com/package/should-enzyme){:target="_blank" rel="noopener"}.

<!--more-->

### Setup

You need EnzymeJS and ShouldJS installed to use Should Enzyme.

Install: `npm i should-enzyme --save-dev`

```js
import "should";
import "should-enzyme";
```

Here is an example extension function to test if a CSS class is in the className string value. 

### `className(string)`

| render | mount | shallow |
| ------ | ----- | ------- |
| yes    | yes   | yes     |

Check to see if wrapper has CSS class.

```jsx
import React from "react";
import { mount, render, shallow } from "enzyme";

const ClassNameFixture = () => (
  <div className="special burger">Content here</div>
);

const wrapper = mount(<ClassNameFixture />);

wrapper.should.have.className("special");
wrapper.should.not.have.className("pizza");
```