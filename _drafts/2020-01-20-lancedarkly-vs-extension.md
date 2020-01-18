---
layout: post
title: "LanceDarkly: VS Code ext for LaunchDarkly toggles"
date: 2020-01-18 06:00:12 +0000
permalink: /projects/lancedarkly-vscode-ext-launchdarkly-toggles
category: projects
published: true
full_image_url: "https://user-images.githubusercontent.com/10452163/58038723-ae054500-7b28-11e9-8799-2d7b5b9a72b1.png"
meta_description: >
  Manage your LaunchDarkly toggles from VS Code
excerpt_separator: <!--more-->
tags: javascript vscode react
---

I created [![LanceDarkly logo](https://user-images.githubusercontent.com/10452163/58038609-3d5e2880-7b28-11e9-9a6c-d219a9a617e0.png) LanceDarkly](https://marketplace.visualstudio.com/items?itemName=RichardKotze.lancedarkly){:target="\_blank" rel="noopener"} which is a VS Code extension to help make it easy to manage [LaunchDarkly](https://launchdarkly.com/){:target="\_blank" rel="noopener"} toggles when coding. What are LaunchDarkly "toggles"? It's a services which enables a way of remotely managing the visibility of features. From trunk based development and continuous deployment toggles enable engineers to build and push feature code onto the live server without the user seeing it. When that feature is ready, the toggle can be switched **on** to make the feature visible for all users. LaunchDarkly toggles have many other options including splitting traffic to enable A/B testing.

Why did I build LanceDarkly?

<!--more-->

![Lancedarkly toggle view](https://user-images.githubusercontent.com/10452163/58038723-ae054500-7b28-11e9-8799-2d7b5b9a72b1.png)

### Problem

Switching between VS Code, _LaunchDarkly_ web app and other toggle integrations is inconvenient during development. Also, the LaunchDarkly app does not provide a view of toggle states (on/off) for **all** environments. It's likely you want the new feature **visible** on local and staging environments but **hidden** on live when developing. It's handy to have an overview of these states the toggle is in which LaunchDarkly does not provide.

### Solution

A VS Code extension to bring LaunchDarkly toggle management closer to your development environment and show **all** environment toggle states. Toggle on/off from VS Code.

### Technical interest

I knew that VS Code extensions had the concept of [WebViews](https://code.visualstudio.com/api/extension-guides/webview){:target="\_blank" rel="noopener"} which enabled you to have your own custom UI features in VS Code rather than restricted to the VS Code APIs. Then I thought would it be possible to build a React application inside these WebViews. I tried this idea out and discovered it was possible.

VS Code limits the way you can access their APIs from a WebView via a simple pub/sub system. It does mean you can send a message to the VS Code side to trigger a built in API, like copy toggle key to the clipboard.

## Features of LanceDarkly

### Toggle ON/OFF

Confirm with optional message to toggle feature ON/OFF.

![Popup confirm toggle ON](https://user-images.githubusercontent.com/10452163/58038930-3c79c680-7b29-11e9-91d7-b8d418ce5aa3.png)

### Dashboard

Dashboard summary of toggles in the project.

![Dashboard of toggles](https://user-images.githubusercontent.com/10452163/58039054-8b276080-7b29-11e9-8c98-7589462c531d.png)

### Filter/search toggles

Search toggles by name, key or description.

![Filter toggles by name](https://user-images.githubusercontent.com/10452163/58039220-fcffaa00-7b29-11e9-8f6b-e753dfe0c40a.png)

Potentially you could have a small project or start a new one without the need of a bundler. If you decide to not use a bundler, I'd like to hear what challenges you faced and what you tried to do to solve them? Let me know on [Twitter](https://twitter.com/share?text=No app bundler needed for your next project? by @richardkotze &url=https://www.richardkotze.com/coding/no-app-bundler-needed&hashtags=javascript,programming,coding){:target="\_blank" rel="noopener"}, or in the comments below.
