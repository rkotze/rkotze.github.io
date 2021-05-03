---
layout: post
title: "Improved Git log in VS Code with Git Ease"
date: 2021-05-02 12:00:12 +0000
permalink: /projects/improved-git-log-vs-code-git-ease
category: projects
published: true
full_image_url: https://user-images.githubusercontent.com/10452163/116859516-03449f00-abf8-11eb-9d53-a3236db634ef.png
meta_description: >
  Git Ease, improve the Git log view and make connecting documents more discoverable
excerpt_separator: <!--more-->
tags: git vs-code
---

[Git Ease](https://marketplace.visualstudio.com/items?itemName=RichardKotze.git-ease){:target="\_blank" rel="noopener"} in <abbr title="Visual Studio Code">VS Code</abbr> aims to improve the Git log view and make connecting documents more discoverable. I will describe the features and list the technologies used to build it.

<!--more-->

![](https://vsmarketplacebadge.apphb.com/installs/RichardKotze.git-ease.svg) [![](https://vsmarketplacebadge.apphb.com/downloads-short/RichardKotze.git-ease.svg)](https://marketplace.visualstudio.com/items?itemName=RichardKotze.git-ease.svg)&nbsp;[![Git Ease VS marketplace](https://vsmarketplacebadge.apphb.com/version-short/RichardKotze.git-ease.svg)](https://marketplace.visualstudio.com/items?itemName=RichardKotze.git-ease)

<img title="Preview of Git Ease" src="https://user-images.githubusercontent.com/10452163/116859516-03449f00-abf8-11eb-9d53-a3236db634ef.png" width="350" />
_Demo of Git Ease in VS Code_

As of writing this post, Git Ease is in its beta/preview stage v0.5.0.

## Features of Git Ease

### Link commits to relevant external sources

The key feature is to link commits to relevant external sources like GitHub and Jira issues. By default _Git Ease_ will link issues by scanning for a hash followed by a number to the repository _origin_ remote like GitHub or BitBucket.

If you use other issue tracking tools like Jira you can add the issue id in the commit and update the Git Ease config with the id pattern to link. See [Git Ease settings](https://github.com/rkotze/git-ease#commit-log---linkpatterns){:target="\_blank" rel="noopener"} for more details. You can add multiple patterns and links to search for to the config, making it flexible to link to many documents you use.

### Copy commit message

Any commit message can be copied directly to the Git SCM input box, making it easier to reuse and remember issue codes.

### Helpful clean UI

Each commit is collapsed and shows only the title of the commit. They can be expanded to see the whole message including authors, co-authors and changed files. Git Emojis are supported in the log view. You will find the Git Ease view in VS Code Git panel to keep in the context of version control.

The **file list** shows the file state like _new_, _modified_, _deleted_ and the other Git states. Clicking on the file name will show the **diff** and clicking the file icon will open it.

Worth mentioning even though it might be expected is when completing a Git action like pull, push or commit the log UI will updated automatically.

### Technologies

<dfn>Git</dfn> is a distributed version control system.

<dfn>VS Code</dfn> is a code editor, with an extension API.

<dfn>TypeScript</dfn> is a language that builds on JavaScript, by adding static type definitions.

<dfn>Svelte</dfn> a small framework for building user interfaces.

<dfn>CSS</dfn> a language used to style HTML elements

<dfn>Webpack</dfn> mainly to bundle JavaScript files, but also capable of transforming and bundling any type of asset.

<dfn>Jest</dfn> a JavaScript testing framework.

If you like the project please [**share**](https://twitter.com/intent/tweet?hashtags=vscode,git,webdev&text=Git%20Ease%2C%20improve%20the%20Git%20log%20view%20and%20make%20connecting%20documents%20more%20discoverable%20in%20VS%20Code%20https://marketplace.visualstudio.com/items?itemName=RichardKotze.git-ease){:target="\_blank" rel="noopener"} with your friends and [**star**](https://github.com/rkotze/git-ease){:target="\_blank" rel="noopener"} the repository.

