---
layout: post
title:  Git and Putty on Windows in command line
date:   2016-03-20 17:00:12 +0000
permalink: top-tips/git-on-windows-in-command-line
category: top-tips
meta_description: >
 How to setup Git with PUTTY on Windows from the command line rather than a Git GUI.
excerpt_separator: <!--more-->
tags: git
---

I've moved away from using a Git GUI to command line, I typically used [GitExtensions](https://sourceforge.net/projects/gitextensions/){:target="\_blank" rel="noopener"}. The reason being, it's a little slow having to open any GUI to make a commit and push. It is quicker to use the command line and a side benefit you learn more about how Git works.

<!--more-->

Alternate option for [**connecting to GitHub using OpenSSH on Windows**](/top-tips/connecting-github-with-openssh-windows)

## Setup a remote connection to GitHub on Windows

One thing that blocked me from getting `git push` and `git pull` to work is the SSH setup on _windows_ can be fiddly. The simplest way round it is to use **Putty** `choco install putty`. Then all that needs to be done is `SET` an environment variable `GIT_SSH` with the value of the path to Putty's `plink.exe`. **Plink** is similar to UNIX SSH for establishing a connection to a remote repository.

Set `GIT_SSH` variable example.

```
SET GIT_SSH=C:\path\to\PuTTY\plink.exe
```

Then you need to add the Git user to plink for the authentication to happen. `plink.exe git@github.com`

Provided you have:
 - [create your SSH keys](https://help.github.com/en/github/authenticating-to-github/adding-a-new-ssh-key-to-your-github-account){:target="\_blank" rel="noopener"} to access your GitHub repository
 - added these to `Pageant.exe` which is the authentication agent.

Command line example to add keys to **pageant**:

```
C:\path\to\PuTTY\pageant.exe d:\path\to\key-a.ppk d:\path\to\key-b.ppk
```

To test out if you can connect to github.com, enter: `plink.exe -v git@github.com`.

If you see a successful authentication message, it should now be possible to `git push` on the command line to your repository.
