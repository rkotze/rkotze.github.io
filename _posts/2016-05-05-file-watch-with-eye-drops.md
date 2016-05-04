---
layout: post
title:  Elixir task file watch with Eye Drops
date:   2016-05-04 17:00:12 +0000
permalink: /projects/elixir-task-file-watch-with-eye-drops
category: projects
meta_description: >
 Elixir task A configurable mix task to watch file changes
---

[Eye drops](https://hex.pm/packages/eye_drops) is an _[Elixir](http://elixir-lang.org/) mix task_ used to watch file changes and run tasks in the command line for those files. You can read more about how to use it on my Github repository [read me documentation](https://github.com/rkotze/eye_drops).

The reason for doing this project was to get faster feedback from unit and acceptance tests in an Elixir project at work. With this running in the background, any updates to the code base the tests would run automatically. This was mostly inspired by working in JavaScript projects which have some sort of watch task built in e.g. npm or gulp. So Eye_Drops is like a **watch task for Elixir** projects.

There's no need to limit the tasks to tests, _Eye drops_ can be configured to run anything in the command line.

Here is an example eye_drops configuration:

{% highlight elixir %}
config :eye_drops, 
  tasks: [
    %{
      id: :unit_tests,
      name: "Unit tests",
      run_on_start: true,
      cmd: "mix test",
      paths: ["lib/*", "test/*"]
    },
    %{
      id: :acceptance,
      name: "Acceptance tests",
      cmd: "mix acceptance",
      paths: ["lib/*", "features/*"]
    }
  ]
{% endhighlight %}

If you have any feedback you can post in Github issues or below in the comments.