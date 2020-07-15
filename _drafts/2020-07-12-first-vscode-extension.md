---
layout: post
title: "Building your first VS Code extension"
date: 2020-07-05 06:00:12 +0000
permalink: /coding/building-your-first-vscode-extension
category: coding
published: true
full_image_url: "https://user-images.githubusercontent.com/10452163/74111687-79418e00-4b8e-11ea-85ef-74fe4b76347e.jpg"
meta_description: >
  Help you with getting started to building your first vscode extension
excerpt_separator: <!--more-->
tags: javascript tutorial vs-code
---

I've built two *VS Code extensions* and thought it would be good to share my thoughts on the best way to kick start building your *first extension*. Key topics I will cover here are the basics about the build, unit testing and a publish/deployment pipeline. 

<!--more-->

## Basics around building an extension

VS Code does a great job to help with getting started on [your first extension](https://code.visualstudio.com/api/get-started/your-first-extension){:target="\_blank" rel="noopener"}. They use a Yeoman generator to set up a basic hello world project which is configured to debug. Debugging is essential and has helped me learn about the VS Code API. All the basics are covered here and is worth reading the whole getting started section.

When you open the project the main entry file `extension.ts` and you should see two functions `activate` `deactivate`. **Activate** is called when an event is fired in VS Code your extension is bound to, for example calling a command via the command palette. **Deactivate** is called when the extension is disabled or uninstalled.

### When things start to get tricky

This is not to scare you but to prepare yourself to be a little patient. The [VS code API](https://code.visualstudio.com/api/references/vscode-api){:target="\_blank" rel="noopener"} is documented but not to the extent everything has example snippets, so there will be a bit of trial and error.

Key thing to understand is VS Code reads certain properties in your extension `package.json` to bind the UI to your extension commands.

**Activation Events** is an array of strings that binds the event to a command id. Every command you define will have a string id. Event and command are split by a colon `:` e.g. `"onCommand:awesomeExt.helloWorld"`. An activation event in your `package.json` might look like this:

```json
{
  "name": "Awesome Ext",
  "activationEvents":["onCommand:awesomeExt.helloWorld"]
}
```

Next is **Contribution Points** which enable you to extend VS Code UI. To help make the command above easy to find, you can give is a searchable title in the command palette. To do this use the `commands` contribution point. See the `package.json` example below:

```json
{
  "name": "Awesome Ext",
  "activationEvents":["onCommand:awesomeExt.helloWorld"],
  "contributes": {
    "commands": [
      {
        "command": "awesomeExt.helloWorld",
        "title": "Hello World",
      }
    ]
  }
}
```

All that is left is to use the **VS Code API** to *register* the command. Inside the `activate` function use the following `registerCommand` method, see below

```javascript
const vscode = require("vscode");

export function activate(){
  vscode.commands.registerCommand("awesomeExt.helloWorld", () => {
      vscode.window.showInformationMessage("Hello World!");
  });
}
```

This is all in the generated project, once you `npm i` and press F5 to launch the extension. Then search the *command palette* to find your "hello world" command.

You are now well on your way to *making your own* VS Code extension.

## How easy is it to unit test my extension?

The VS code extension is essentially still a JavaScript project and so you can use any testing framework you like. To help with this I've written a post on [unit tests and mocking VS Code API using Jest](/coding/unit-test-mock-vs-code-extension-api-jest). It provides **working unit test examples** for mocking the API based off my Git Mob VS Code extension.

## Publish your extension

To help speed up the process of publishing to the **Visual Studio Market Place** I've created a post about [deploy VS code extension via Azure pipeline](/coding/deploy-vscode-extension-azure-pipeline). This covers how to build and deploy your extension but also from an automated pipeline. To further improve the pipeline like running unit tests I've also publish this, [build a CD Azure pipeline](/coding/build-ci-azure-pipeline-vscode-extension).

## More example code

To understand more about how the VS Code API, here is a repo full of working examples you can try out, code extension examples](https://github.com/Microsoft/vscode-extension-samples/){:target="\_blank" rel="noopener"}. I recommend cloning the repo, run the extensions and placing some debug points to explore the examples.

Hope this helps you accelerate the development of your VS code extension but if you know of more resources please to put a link in the comments below.

[Share on Twitter](https://twitter.com/share?text=Building your first VS Code extension by @richardkotze &url=https://www.richardkotze.com/coding/building-your-first-vscode-extension&hashtags=javascript,vscode){:target="\_blank" rel="noopener"}.
