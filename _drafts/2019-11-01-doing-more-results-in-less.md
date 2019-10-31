---
layout: post
title: "Doing more results in less done"
date: 2019-10-30 06:00:12 +0000
permalink: /opinion/doing-more-results-in-less-done
category: opinion
full_image_url: https://user-images.githubusercontent.com/10452163/66151454-418a6e80-e60f-11e9-99a4-621c67d20c8c.jpg
meta_description: >
  Managing many tasks in your scrum board will result in less done
excerpt_separator: <!--more-->
---

Typically _'speed of delivery'_ is a key measure for an Agile software engineering team. However, sometimes you notice a pattern of weeks ending with high or low points, and this affects the predictability of your delivery. So how can you make delivery more consistent?

This post will focus more on pace of delivery and around team processes, rather than tooling to reduce overheads, like automation. The reason you want to achieve predictable delivery, is so that your team can confidently estimate what can be done in a sprint. This can also help product and business estimate how long a feature could take to deliver.

<!--more-->

I appreciate there are many things which affect pace of delivery. However I would like to focus on just this one:

## Limit work in progress (WIP)

Key benefits of limiting <abbr title="Work in progress">WIP</abbr>:

- Focus on delivering items closest to "Done"
- Promote better communication to unblock tasks
- Create an improved 'team mentality' to support the team objective
- Identify/highlight issues in the delivery flow
- Improve the quality of work delivered

### Setup limiting WIP

Lets start with some context: tasks move left to right through different states on a board which contains the following columns **To Do**, **In Progress**, **Review** and **Done**. The <abbr title="Work in progress">WIP</abbr> columns are **In Progress** and **Review**. How do you determine the limit? This should be agreed among the team, but I would recommend limiting to the number by team members plus one or if you pair program, the number of pairs plus one. When a ticket moves to review that pair should check if there are any work items that can be reviewed, if none then start a new ticket.

### How does limiting WIP achieve these points?

Here's an example of a team of four who pair program: What happens if WIP is at this team's limit of three tasks (two items from one pair is in review)? How do you move forward without breaking this rule of maximum three tasks in WIP? The pair, now effectively blocked, should encourage the other pair to review as soon as possible, by stopping their work. Admittedly this is disruptive, but the point here is to be _supportive_ of each other to achieve the sprint. The payoff to this disruption is that if there are any review actions to take it can be dealt with straightaway and moved to done sooner. Additionally, the shorter time a ticket spends in review the more the original pair will remember their reasoning.

When the WIP limit rule is not followed, you could end up with more than one ticket which nobody is working on, resulting in constant context switching. You might notice checklists to keep track but this is an overhead that can confuse and slow things down. A feature could be split into several tickets, and when they are all in WIP some tasks might end up being delivered under a different ticket for convenience. This makes it difficult to track changes for individual tickets.

Ultimately, limiting WIP will prevent several items being in progress and improve the quality of work delivered.

If the WIP limit causes blocking regularly, this highlights a potential issue in the work flow. This should be brought up in retro to identify what could be causing the issue, eg, maybe there is a big disparity between ticket complexity?

## That's it for now

Hopefully this has been a thought-provoking post to help streamline an Agile software team. Share you thoughts on limiting WIP in the comments below or [@richardkotze](https://twitter.com/richardkotze){:target="\_blank" rel="noopener"} on Twitter.
