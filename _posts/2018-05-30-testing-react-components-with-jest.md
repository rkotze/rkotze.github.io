---
layout: post
title: "React testing library & Jest"
date: 2018-05-30 12:00:12 +0000
permalink: /coding/react-testing-library-jest
category: coding
published: false
meta_description: >
 Try out Kent C. Dodds React testing library and Jest
excerpt_separator: <!--more-->
---

**How do you unit test your React components?** There are plenty testing libraries to help support testing your React app. I'm going to look at using [Jest](https://facebook.github.io/jest){:target="\_blank"} and Kent C. Dodds [React testing library](https://github.com/kentcdodds/react-testing-library){:target="\_blank"}

## A quick reflection

When React was in it's `0.x` versions it was a real struggle to test your components. Lots of ideas and opinions but no clear test setup. One way was to render a component into a headless browser or an emulated DOM environment using the now deprecated method `React.render(<MyApp />, document.body)`. Then find the component in the DOM `dom = React.findDOMNode(component)`.

I worked on a React project where we decided to use JSDOM v3.x and this had some [painful setup](https://github.com/jsdom/jsdom/tree/3.x#contextify){:target="\_blank"} especially using a Windows OS. Having to install Python 2.7 and Visual Studios Express to compile native modules for your machine. All this to run tests locally but eventally it would _fairly_ consistently. Setting up a CI pipeline also had its challenges. I'm glad a lot of effort from the JavaScript community has go into improving JSDOM. Now it has become the default DOM environment to test your React app in. It is as simple as `npm i jsdom -D` and with a little setup it works.

## The debate of how to test your component

React regularly makes me debate what kind of testing you're doing, mostly between unit, integration and UI testing. Having access to the DOM in the test makes it easy to trigger click events and asserting the result. This is a form of UI testing but you're probably writting it like a unit testing rather than in a behavioural test ()

What i like is Kent has defined how he would like React tests should be written and this president is really useful for aligning a team on how to approach testing in their app. 