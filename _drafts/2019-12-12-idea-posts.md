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

# Graphql server validation errors

Make it part of the mutation payload object.

# Implement JWT authentication for GraphQL server

- Express middleware
- The role of access token and refresh tokens

# Consistent complexity scoring

In your team you are flexible on pair programming and generally decide that we will pair if someone needs help or the work is complex. This causes an issue with items piling up in review because the easy items move quickly to review and the engineer decides to start a new work, but they take on another easy task that skips over to review fairly soon while the other pair on a complex issue. When the complex task moves over to review finally the pair is free to review the small items.

The pair working on the complex issue could review items immediately but this comes at the cost of losing your line of thought to solving the issue they were working on. It will become frustrating if more things move to review quickly.

If there is feedback for code changes then the engineer starting a new task needs to address those, this means one item in the flow is not being worked on. Typically things nearest to done are of higher priority, so best to stop what is in progress but this will mean another costly context switch as well.

Then the person soloing goes on annual leave with work in progress and the other team members are not sure where they left off.

How can we mitigate these issues?

- Be strict on pairing, so pair on the simple tasks.
- Limit the WIP to the number of pairs you have for the day.
- I recommend that each work item is similar in complexing to each other. This should help with getting items into review in a similar time frame.

* You could agree that pairing on simple tasks means it could skip review.

* Opinion on the value of limiting WIP to the number of pairs you have
* The danger of having doing simple tasks solo
* The challenge of reviewing code #honest

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
