---
layout: post
title: "Co-author commits with Git Mob"
date: 2019-06-24 12:00:12 +0000
permalink: /projects/co-author-commits-with-git-mob
category: projects
published: true
full_image_url: https://user-images.githubusercontent.com/10452163/51446144-cc3b6f80-1d05-11e9-87fa-96622a25eedc.gif
meta_description: >
 Co-author commits with Git Mob in VS Code which will show in GitHub
excerpt_separator: <!--more-->
---

With the creation of [Git Mob](https://github.com/findmypast-oss/git-mob){:target="\_blank"}, a console app to _manage your co-authors_ you pair with, I thought a good addition would be to build a UI around it in VS Code. This makes it super simple to see who you are co-authoring with and change without needing to remember any commands. Most importantly it consistently generates the meta data for _co-authoring commits_ to GitHub. See [Git Mob for VS Code](https://github.com/rkotze/git-mob-vs-code){:target="\_blank"} repository to get started.

<!--more-->

{:.noWidth}
[![Git Mob vs marketplace](https://vsmarketplacebadge.apphb.com/version-short/RichardKotze.git-mob.svg)](https://marketplace.visualstudio.com/items?itemName=RichardKotze.git-mob)&nbsp;![Git Mob project stars on GitHub](https://img.shields.io/github/stars/rkotze/git-mob-vs-code.svg?style=social&label=Star)&nbsp;![Git Mob project watchers on GitHub](https://img.shields.io/github/watchers/rkotze/git-mob-vs-code.svg?style=social&label=Watch)

![Git Mob VS Code demo](https://user-images.githubusercontent.com/10452163/51446144-cc3b6f80-1d05-11e9-87fa-96622a25eedc.gif)
_Demo of Git Mob in VS Code_

## Features of Git Mob for VS Code

The _VS Code extension_ needs Git Mob console app to be install for it work. The reason for this is if you are switching between console and VS Code the state of selected authors in sync.

Git Mob is integrated with the Git tab in VS Code so it's there to remind you to update/change your co-authors when pair programming.

The list shows who is selected, not selected and other contributing authors which are not included in your `.git-coauthors` file. This allows you to easily add new authors to your list without typing in their details.

Selecting the search icon on **More Authors** lets you filter through and add to your `.git-coauthors` file which is handy if their is a lot of contributors.

The title bar has an action to open your `.git-coauthors` file to allow you to manage your _co-authors_ and when you save the file the UI is updated instantly.

If there are any ideas you want to see in Git Mob VS Code please create an issue or fork the repository and make a pull request.

If you like the project please [**share**](https://twitter.com/intent/tweet?hashtags=pairProgramming,gitmob&text=Co-author%20commits%20using%20Git%20Mob%20VS%20Code%20extension%20https://marketplace.visualstudio.com/items?itemName=RichardKotze.git-mob){:target="\_blank"} with your friends and [**star**](git-mob-vs-code){:target="\_blank"} the repository. 

You can read more about [Git Mob in this post](https://tech.findmypast.com/co-author-commits-with-git-mob/){:target="\_blank"}.

