---
layout: post
title: "Unit test your VS Code extension with Jest"
date: 2020-01-02 06:00:12 +0000
permalink: /coding/unit-test-vs-code-extension-jest
category: coding
published: true
image: "https://user-images.githubusercontent.com/10452163/70393368-f0b53e80-19e0-11ea-85fd-e7b415a4a31b.jpg"
meta_description: >
  Examples using Jest for mocking and unit testing a VS Code extension
excerpt_separator: <!--more-->
tags: javascript vs-code unit-testing
---

An issue with unit testing vscode extensions is the `vscode` dependency, which is needed to utilise the editors features but will error when running unit tests. Also this is a dependency outside the scope of your project, so the answer is to mock the API.
The dependency is fine when running end-to-end tests, however unit tests give quicker feedback on the details.

- Link to getting started with vs code extensions
- How to setup Jest
- How to mock vscode API
- Example of a mock in action
