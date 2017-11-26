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

Here is an example of how that might happen using the kata [diamond pattern](https://www.codewars.com/kata/complete-the-pattern-number-9-diamond){:target="_blank"} on Codewars.

<!--more-->

Test-driven development requires you to write a test first which helps you to move a step closer to solving the problem. A classic workflow is *Red, Green, Refactor*. Then means write a failing unit test first (red), make it pass (green) and is there anything that can be done to improve the code quality (refactor). More on classic TDD read [The cycles of TDD](http://blog.cleancoder.com/uncle-bob/2014/12/17/TheCyclesOfTDD.html){:target="_blank"} by Uncle Bob.

Each test passing should give you confidence to commit to master and the pace should be consistent. So there should not be a sudden slow down in your progress. I will explain more after the first round below.

## First round

Be strict and spend **15 minutes** trying to solve the [diamond pattern kata](https://www.codewars.com/kata/complete-the-pattern-number-9-diamond){:target="_blank"} using classic TDD.

No problem if you have not solved it. What you need to do is be aware of where you got stuck. Are you stuck about **two or four** unit tests in? Is it testing `pattern(2)`?

```js
pattern(2) ->
 1
121
 1
```

Why is this the test that is stopping you? It looks simple enough, right? It might be because you are essentially solving the whole of the kata at this point. This is quite complex for our minds to handle all the cases to resolve and think about where to start.

