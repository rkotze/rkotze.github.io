---
layout: post
title:  Git on windows in command line
date:   2016-03-20 17:00:12 +0000
permalink: top-tips/git-on-windows-in-command-line
category: top-tips
meta_description: >
 How to use Git on windows from the command line rather than a Git GUI. 
 Also a mention to SublimeGit package.
---

I typically use [GitExtensions][1] as my Git client tool but it's a little annoying having to open any Git client to make a commit and push. It is quicker to use the command line.

One thing that blocked me from `git push` is the ssh setup on _windows_ can be fiddly. I've setup putty with GitExtensions and it turns out if you set a environment&nbsp;variable `GIT_SSH` and point it to `plink.exe` you can now run `git push` on the command line and you won't get permission denied.&nbsp;Example command below to set variable.

{% highlight bash %}
SET GIT_SSH=C:\Puttyplink.exe
{% endhighlight %}

You will need the authentication tool in putty to load the correct ssh key. Example below:

{% highlight bash %}
c:\pathtopageant.exe c:\pathtoprivate-ssh-key.ppk`
{% endhighlight %}

## Git in Sublime

Try out [SublimeGit package][2]. You have most of the Git functionality and you don't need to leave Sublime.

[1]: https://sourceforge.net/projects/gitextensions/
[2]: https://packagecontrol.io/packages/SublimeGit
  