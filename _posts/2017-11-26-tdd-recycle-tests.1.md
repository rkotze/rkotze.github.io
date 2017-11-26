---
layout: post
published: false
title:  "Recycle tests TDD"
date:   2017-02-12 12:00:12 +0000
permalink: /coding/recycle-tests-tdd
category: coding
meta_description: >
 The constraints of TDD and how recycling tests could help unblock your work flow. 
excerpt_separator: <!--more-->
---

Have you ever written a unit test and it seems to take a long time to make that test green?

I've got an example of how that might happen using the kata [diamond pattern](https://www.codewars.com/kata/complete-the-pattern-number-9-diamond){:target="_blank"} on Codewars.

<!--more-->

Test-driven development requires you to write a test first which helps you to move a step closer to solving the problem. A classic workflow is *Red, Green, Refactor*. Then means write a failing unit test first (red), make it pass (green) and is there anything that can be done to improve the code quality (refactor). More on classic TDD read [The cycles of TDD](http://blog.cleancoder.com/uncle-bob/2014/12/17/TheCyclesOfTDD.html){:target="_blank"} by Uncle Bob.

