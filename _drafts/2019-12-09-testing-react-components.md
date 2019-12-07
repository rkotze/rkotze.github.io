---
layout: post
title: "Mocking strategies for testing a React app using Jest"
date: 2019-12-07 12:00:12 +0000
permalink: /coding/mocking-strategies-testing-react-using-jest
category: coding
published: true
image: "testing-tools.jpg"
meta_description: >
  Examples on mocking a React component to test it using Jest and react-testing-library
excerpt_separator: <!--more-->
tags: javascript react unit-testing
---

This won't be a deep dive into unit testing components in a React app but I will present some options for mocking external APIs. This is seen a good practice at the unit test level as we don't want these tests dependant on external API which will slow the feedback down and make essentially it will make the test fragile. Mocking is typically used quite loosely and there is plenty of nuance when we throw _spies_ and _stubs_ in the mix. However, they do have particular meaning and I like they are all placed under the generic term of [Test Double](https://martinfowler.com/bliki/TestDouble.html){:target="\_blank" rel="noopener"} as described by Martin Fowler.

Essentially a mock is about replacing the actual implementation with a set of functions that enable you to assert how the function was used. Using test libraries like [Jest](https://jestjs.io/docs/en/mock-functions){:target="\_blank" rel="noopener"} we get this functionality to use in our asserts for example was it called and with the correct parameters. Jest has build a simple API for managing mocks and does not break out into a more generic Test Double library which I find gets confusing quick.

<!--more-->

First thing we are going to look at is most React app make a http call to an service. In this example we make an a call to the [SWAPI](https://swapi.co/){:target="\_blank" rel="noopener"} API to get the names of characters in Star Wars. What we want to test is when that character is selected we show details of them.


