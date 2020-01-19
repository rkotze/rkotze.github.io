---
layout: post
title: "LanceDarkly: manage feature toggles in VS Code"
date: 2020-01-20 06:00:12 +0000
permalink: /projects/lancedarkly-manage-feature-toggles-vs-code
category: projects
published: true
full_image_url: "https://user-images.githubusercontent.com/10452163/58038723-ae054500-7b28-11e9-8799-2d7b5b9a72b1.png"
meta_description: >
  LanceDarkly is a VS Code extension to help manage LaunchDarkly toggles
excerpt_separator: <!--more-->
tags: javascript vscode react
---

I created [![LanceDarkly logo](https://user-images.githubusercontent.com/10452163/58038609-3d5e2880-7b28-11e9-9a6c-d219a9a617e0.png) LanceDarkly](https://marketplace.visualstudio.com/items?itemName=RichardKotze.lancedarkly){:target="\_blank" rel="noopener"}, a VS Code extension to help make it easy to manage [LaunchDarkly](https://launchdarkly.com/){:target="\_blank" rel="noopener"} toggles without leaving the editor. What are LaunchDarkly toggles? It's a service which enables a way of remotely managing the visibility of app features. Toggles are especially handy for trunk-based development and continuous deployment practices by enabling engineers to build features without the end-user seeing it. When that feature is ready, the toggle can be switched **on** to make the feature visible for all. LaunchDarkly toggles have many other options including splitting traffic to provide a way to split test.

Why did I build LanceDarkly?

<!--more-->

![Lancedarkly toggle view](https://user-images.githubusercontent.com/10452163/58038723-ae054500-7b28-11e9-8799-2d7b5b9a72b1.png)
_LanceDarkly toggle view in VS Code_

### Problem

Switching between VS Code, _LaunchDarkly_ web app and other toggle integrations are inconvenient during development. Also, the LaunchDarkly app does not provide a view of toggle states (on/off) for **all** environments. It's likely you want the new feature **visible** on local and staging environments but **hidden** on production when developing. It's handy to have an overview of these states which LaunchDarkly does not provide.

### Solution

A VS Code extension to bring LaunchDarkly toggle management closer to your development environment and show **all** environment toggle states. Toggle on/off from VS Code. Essentially a place to view all toggle information including other integrations using a plugin API.

## VS Code WebViews using React

I knew that VS Code extensions had the feature of [WebViews](https://code.visualstudio.com/api/extension-guides/webview){:target="\_blank" rel="noopener"} which enables you to have custom UI elements rather than restricted to the VS Code APIs. Then I thought would it be possible to build a [React JS](https://reactjs.org/){:target="\_blank" rel="noopener"} application inside these WebViews. I tried this idea out and discovered it was possible.

VS Code limits the way you can access their APIs from a WebView through a simple[ pub/sub system](https://medium.com/better-programming/the-publisher-subscriber-pattern-in-javascript-2b31b7ea075a){:target="\_blank" rel="noopener"}. This means you can send a message to the VS Code side to trigger a built-in API, like copy _toggle key_ to the _clipboard_. It also means you can send messages from the VS Code to the WebView. In a way, you can think of _VS Code_ as the **server** and the _WebView_ as the **browser** and they send messages to each other.

If you're interested in how I set up the React application in VS Code extension you can start here, [React WebView index](https://github.com/rkotze/lancedarkly/blob/master/src/webviews/index.js){:target="\_blank" rel="noopener"}. You will see it's wrapped in a context provider, this listens to messages sent from VS Code and relays that message on to any subscribing functions.

I have used [Webpack](https://webpack.js.org/){:target="\_blank" rel="noopener"} to build both WebViews to use the latest JavaScript features like `import`. You can run `npm run build` which will build the development code and watch for changes. When you're ready to publish VS Code extensions reads the `package.json` **scripts** `vscode:prepublish` as a hook which will trigger a production Webpack build that optimises the code to make the extension package as small as possible. 

If you are interested in contributing you can find [LanceDarkly GitHub repo](https://github.com/rkotze/lancedarkly){:target="\_blank" rel="noopener"} here and follow the contributor guidelines.

## Core features of LanceDarkly

### Toggle ON/OFF

Confirm with optional message to toggle feature ON/OFF.

![Popup confirm toggle ON](https://user-images.githubusercontent.com/10452163/58038930-3c79c680-7b29-11e9-91d7-b8d418ce5aa3.png)

### Dashboard

Dashboard summary of toggles in the project. It shows the total number of toggles created for a project and group by age totals. 

![Dashboard of toggles](https://user-images.githubusercontent.com/10452163/58039054-8b276080-7b29-11e9-8c98-7589462c531d.png)

### Filter/search toggles

Search toggles by name, key or description.

![Filter toggles by name](https://user-images.githubusercontent.com/10452163/58039220-fcffaa00-7b29-11e9-8f6b-e753dfe0c40a.png)

### Plugins API

You might have additional integrations which use LaunchDarkly toggles and you want to see that data. Plugins allow you to add read-only data in a toggle view and preventing the need to jump to another app.

The downside of LaunchDarkly is it's not a free tool but it does have a free trial if you want to give it a go. If you have ideas or feedback for LanceDarkly then please [tweet it](https://twitter.com/share?text=LanceDarkly: manage feature toggles in VS Code by @richardkotze &url=https://www.richardkotze.com/projects/lancedarkly-manage-feature-toggles-vs-code&hashtags=javascript,programming,coding){:target="\_blank" rel="noopener"}.
