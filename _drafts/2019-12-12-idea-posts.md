---
layout: post
title: "Idea/Draft posts"
date: 2019-10-21 13:00:12 +0000
permalink: /ideas
category: coding
excerpt_separator: <!--more-->
---

See all the ideas.

<!--more-->

# Unit test your VS Code extension with Jest

An issue with unit testing vscode extensions is the `vscode` dependency, which is needed to utilise the editors features but will error when running unit tests. Also this is a dependency outside the scope of your project, so the answer is to mock the API.
The dependency is fine when running end-to-end tests, however unit tests give quicker feedback on the details.

- Link to getting started with vs code extensions
- How to setup Jest
- How to mock vscode API
- Example of a mock in action

# Hidden code crouching bug

- Opinion on the value of limiting WIP to the number of pairs you have
- The danger of having doing simple tasks solo
- The challenge of reviewing code #honest

# Graphql server validation errors

Make it part of the mutation payload object.

# Implement JWT authentication for GraphQL server

- Express middleware
- The role of access token and refresh tokens

# Azure pipeline thoughts

### Why have a delivery pipeline?

Generally a delivery pipeline gives you confidence that your app is functioning as you expect it and preventing regression. Including a delivery step will help reduce the over head of remembering the commands to run to release into production. However, there is a lot more about the importance of having a pipeline, you can read more from my post on [CI and continuous delivery (CD)](/continuous-integration-delivery-deployment)

### What I like Azure pipeline

As far as Azure pipelines are concerned I thought it would be worth trying to see how well it worked and the benefits of using it.

- It's free and you get a lot of good features for the free tier
- You can provide a configured yaml file which manages a good variety of steps. This allows you to version control your pipeline, which is always handy.
- The pipeline UI is clean and simple to navigate
- You can construct the pipeline in the UI with a load of predefined tasks then copy the yaml out to your project.
- I found the pipeline configuration really flexible which in a way is good/bad
- Lots of documentation about specific features and a few get started tutorials which I found handy.
