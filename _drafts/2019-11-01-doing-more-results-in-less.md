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

Typically speed of delivery is a key measure for an Agile software engineering teams but sometimes you notice a pattern that some weeks you end with high or low points. This affects how predictable your delivery is, so how can you make delivery more consistent for a delivery team?

This post will focus more on pace of delivery and around the teams processes. It won't cover tooling to reduce overheads, like automation. The reason you want to achieve predictable delivery, is so that a team can confidently estimate what can be done in a sprint. This can also help product and business estimate how long a feature could take to deliver.

<!--more-->

I appreciate there are many things which affect pace of delivery however I would like to focus on this one.

## Limit work in progress (WIP)

Keep benefits of limiting <abbr title="Work in progress">WIP</abbr>:

- Focus on delivering items closest do "Done"
- Promote better communication to unblock tasks
- Create an improved team mentality to support the team objective
- Identify/highlight issues in the delivery flow
- Improve the quality of work delivered

### Setup limiting WIP

Lets start with some context, tasks move left to right through different states on a board which contains the following columns **To Do**, **In Progress**, **Review** and **Done**. The <abbr title="Work in progress">WIP</abbr> columns are **In Progress** and **Review**. How do you determine the limit? This should be agreed among the team but I would recommend limiting to the number by team members plus one or if you pair program, the number of pairs plus one. Then the next rule should be when a ticket moves to review that pair should check if there are any work items they can be reviewed. If none to review then start a new ticket

### How does limiting WIP achieve these points?

What happens if WIP is at maximum, because for a team of four which pair programs has a limit of three, two items from that pair are in review. How do you move forward without breaking the rule? The pair, now blocked, should encourage the others to have a look a soon as possible by stopping their work. The point here is to be supportive of each other to achieve the sprint goal. The benefit here is if there are any review actions to take it can be dealt with the straight a way and moved to done sooner. Another issue this addresses is, the longer a ticket stays in review the less the original pair will remember their reasoning. Ultimately limiting WIP we will prevent several items in progress and improve the quality of work delivered.

If the WIP limit causes blocking regularly then this also highlights a potential issue in the flow. There should be a retro discussion to identify what could be causing the issue, maybe there is a big disparity between ticket complexity.

## Consistent complexity scoring

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
