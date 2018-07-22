---
layout: post
title:  Use OpenSSH to push to GitHub on Windows
date:   2018-07-25 12:00:12 +0000
permalink: top-tips/use-openssh-push-github-windows
category: top-tips
published: false
meta_description: >
 How to setup OpenSSH with Git on Windows using commander
excerpt_separator: <!--more-->
---

Here are the steps to setup OpenSSH with Git to connect to a repository on GitHub.

I use Windows as my main OS and use [Cmder](http://cmder.net/){:target="\_blank"} as my terminal. Installing the full version you will get _Git for Windows_ which has looks of applications including OpenSSH.

<!-- more -->

Note: https://gist.github.com/jexchan/2351996

Steps:

1. ssh-keygen -t rsa -C "your@email.here"
1. ssh-add ~/.ssh/id_rsa
1. Add you public key to GitHub `settings -> SSH and GPG keys`

You will also need to let Git know the SSH client to use. Add/Update the environment variable `GIT_SSH` with the path (`C:cmder\vendor\git-for-windows\usr\bin\ssh.exe`)

With this setup, you **should now be able to push/pull/clone** a GitHub repository.


**Issue** I came across with `ssh-agent`:

This error appear: **unable to start ssh-agent service, error :1058**

If found that the service was disabled. Type in services in the start menu and open the Services app. Look for **OpenSSH Authentication Agent** and set it to Automatic.

If you want to us [PuTTY with Git](/top-tips/git-on-windows-in-command-line) checkout out my previous post.
  