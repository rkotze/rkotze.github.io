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

Typically speed of delivery is a key measure for an Agile software engineering teams but sometimes you notice a pattern that some weeks you end with high or low points. This affects how predictable your delivery is, so how can you make delivery more consistent for a software delivery team? 

This post will focus more on pace of delivery and around the teams processes to do that. It won't cover tooling to reduce overheads like automation. The reason you want to achieve predictable delivery, is so that a team can confidently estimate what can be done in a sprint. This can also help product and business estimate how long a feature could take to deliver. 

## Limit work in progress

Lets say tasks move left to right through different states on a board which contains the columns **To Do**, **In Progress**, **Review** and **Done**. The <abbr title="Work in progress">WIP</abbr> columns are In Progress and Review. How do you determine the limit? This should be agreed among the team but, I would recommend limiting to the number by team members plus one or if you pair program, then the number of pairs plus one. If you agree to one of those options then the next rule should be when a ticket moves to review that pair should check if there are any work items they can review. Taking on another ticket without a review would break the teams WIP rule.



In your team you are flexible on pair programming and generally decide that we will pair if someone needs help or the work is complex. This causes an issue with items piling up in review because the easy items move quickly to review and the engineer decides to start a new work, but they take on another easy task that skips over to review fairly soon while the other pair on a complex issue. When the complex task moves over to review finally the pair is free to review the small items.

The pair working on the complex issue could review items immediately but this comes at the cost of losing your line of thought to solving the issue they were working on. It will become frustrating if more things move to review quickly.

If there is feedback for code changes then the engineer starting a new task needs to address those, this means one item in the flow is not being worked on. Typically things nearest to done are of higher priority, so best to stop what is in progress but this will mean another costly context switch as well.

Then the person soloing goes on annual leave with work in progress and the other team members are not sure where they left off.

How can we mitigate these issues?

- Be strict on pairing, so pair on the simple tasks. 
- Limit the WIP to the number of pairs you have for the day.
- I recommend that each work item is similar in complexing to each other. This should help with getting items into review in a similar time frame.


- You could agree that pairing on simple tasks means it could skip review.

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
