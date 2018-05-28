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

<!--more-->
## A quick reflection

When React was in it's `0.x` versions it was a real struggle to test your components. Lots of ideas and opinions but no clear test setup. One way was to render a component into a headless browser or an emulated DOM environment using the now deprecated method `React.render(<MyApp />, document.body)`. Then find the component in the DOM `dom = React.findDOMNode(component)`.

I worked on a React project where we decided to use JSDOM v3.x and this had some [painful setup](https://github.com/jsdom/jsdom/tree/3.x#contextify){:target="\_blank"} especially using a Windows OS. Having to install Python 2.7 and Visual Studios Express to compile native modules for your machine. All this to run tests locally but eventually it would _fairly_ consistently. Setting up a CI pipeline also had its challenges. I'm glad a lot of effort from the JavaScript community has go into improving JSDOM. Now it has become the default DOM environment to test your React app in. It is as simple as `npm i jsdom -D` and with a little setup it works.

## The debate of how to test your component

I have often had regular debates with colleagues about what kind of testing you're doing when building a React app, unit, integration or UI testing. The confusion comes from a few points:

- React combines the view with in a class
- You start off writing unit tests and start feel you're testing too many parts once
- Having access to the DOM in the test makes it easy to trigger events and asserting the result.

These things are not typical of unit testing in other frameworks and languages like C#.NET, Python, JavaScript. Frameworks that followed the MV* model would separate out your views from your data classes.

However I find it a good idea to take a step back from what you're use too and decide what is a unit test. It is normal for people have different views on this and I like how Martin Fowler sets this out:

> But really it's a situational thing - the team decides what makes sense to be a unit for the purposes of their understanding of the system and its testing. [Martin Fowler]

Kent C. Dodds has done something similar in _React testing library_. By defining a clear way React unit tests should be written, this precedent is really useful for aligning a team on how to approach testing in their app. This principle is:

> [The more your tests resemble the way your software is used, the more confidence they can give you.](https://twitter.com/kentcdodds/status/977018512689455106){:target="\_blank"}

This approach means testing your components in a similar way to how a user would use your app. Technically the library queries and interacts with the rendered DOM nodes. To me this is similar to UI testing which is typically slow but setting it up like a unit test environment makes it fast.

## Setup time to write the first test

I'm going to add this to an existing project and see how long it takes to setup to start writing a passing unit test.
I'm going to add this to an existing project and see how long it takes to setup to start writing a passing unit test.



[Martin Fowler]: https://martinfowler.com/bliki/UnitTest.html
