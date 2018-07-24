---
layout: post
title:  Git and Putty on Windows in command line
date:   2016-03-20 17:00:12 +0000
permalink: top-tips/git-on-windows-in-command-line
category: top-tips
meta_description: >
 How to setup Git with PUTTY on Windows from the command line rather than a Git GUI.
---

I've moved away from using a Git GUI to command line, I typically used [GitExtensions][1]. The reason being, it's a little annoying having to open any GUI to make a commit and push. It is quicker to use the command line and you learn more about how Git works.

## `Git push` and `pull` on Windows

One thing that blocked me from a simple `git push` is the SSH setup on _windows_ can be fiddly. The simplest way round it is to use putty `choco install putty`. Then all that needs to be done is `SET` an environment variable `GIT_SSH` with the value of the path to Putty's `plink.exe`. Plink is similar to UNIX SSH as it creates access to your repository on a remote.

Set `GIT_SSH` variable example.

{% highlight bash %}
SET GIT_SSH=C:\path\to\PuTTY\plink.exe
{% endhighlight %}

Then you need to add the Git user to plink for the authenication to happen. `plink.exe git@github.com`

Provided you have:
 - created your SSH keys to access your Git repository
 - added these to `Pageant.exe` which is the authentication agent

To test out if you can connect to your github.com remote, enter: `plink.exe -v git@github.com`.

If you see a successful authentication message, it should now be possible to `git push` on the command line to your repository.

How to add your SSH key to Pageant.

{% highlight bash %}
C:\path\to\PuTTY\pageant.exe c:\pathtoprivate-ssh-key.ppk`
{% endhighlight %}

## Git in Sublime

Try out [SublimeGit package][2]. You have most of the Git functionality and you don't need to leave Sublime.

See my post for [**connecting to GitHub with OpenSSH on Windows**](/top-tips/connecting-github-with-openssh-windows)

[1]: https://sourceforge.net/projects/gitextensions/
[2]: https://packagecontrol.io/packages/SublimeGit
  