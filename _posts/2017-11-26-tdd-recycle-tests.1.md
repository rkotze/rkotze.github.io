---
layout: post
published: false
title:  "Recycle tests TDD and code kata"
date:   2017-11-26 12:00:12 +0000
permalink: /coding/recycle-tests-tdd-code-kata
category: coding
meta_description: >
 The constraints of TDD and how recycling tests could help unblock your workflow. 
excerpt_separator: <!--more-->
---

Have you ever written a unit test and it seems to take a long time to make green?

The [diamond pattern](https://www.codewars.com/kata/complete-the-pattern-number-9-diamond){:target="_blank"} kata on Codewars might make you fall into that position again.

<!--more-->

The workshop at Agile Scotland conf by [Seb Rose](http://leanagile.scot/2017/sessions/index.php?session=92){:target="_blank"} motivated me to write this post.

Test-driven development requires you to write a test first which helps you to move a step closer to solving the problem. A classic workflow is *Red, Green, Refactor*. Then means write a failing unit test first (red), make it pass (green) and is there anything that can be done to improve the code quality (refactor). More on classic TDD read [The cycles of TDD](http://blog.cleancoder.com/uncle-bob/2014/12/17/TheCyclesOfTDD.html){:target="_blank"} by Uncle Bob.

Each test passing should give you confidence to commit to master and the pace should be consistent. So there should not be a sudden slow down in your progress. I will explain more after the first round below.

## First round

Be strict and spend **20 minutes** trying to solve the [diamond pattern kata](https://www.codewars.com/kata/complete-the-pattern-number-9-diamond){:target="_blank"} using classic TDD.

No problem if you have not solved it. What you need to do is be aware of where you got stuck. Are you stuck about **two or four** unit tests in? Is it testing `pattern(2)`?

```js
pattern(2) ->
 1
121
 1
```

## Why (╯°□°)╯︵ ┻━┻ ...

Why is this the test that is stopping you? Essentially you are solving the whole of the kata at this point. This is quite complex for our minds to handle all the cases to resolve and think about where to start.

## How to make progress?

First brain storm all cases you need to handle to help reduce the overload. Below is some for example might be:

- Spacing on each row
- Each row reflect the numbers between row number e.g. 12321
- Add new line at end of each row
- Reflex the top half of the diamond

## Recycling your test

Idea is to take each of these points one at a time and start where you got stuck. Each time you solve one update the **assert** to handle the next point. **Don't** make another assert as the previous one will break. Essentially progress by tweaking the test until it gets to the point it is useful for regression.

Notable the workflow pattern is different as you will be on the same unit test. It will be something like **red, green, green, green, ...** until you solve it.

## Second round

Try again and spend **20 minutes** trying to solve the [diamond pattern kata](https://www.codewars.com/kata/complete-the-pattern-number-9-diamond){:target="_blank"} using this recycling method.

After the 20 minutes there should be a better feeling of progress instead of overwhelmed and blocked.

Has this helped you solve the kata? Please write comments below on what you think of this approach below.