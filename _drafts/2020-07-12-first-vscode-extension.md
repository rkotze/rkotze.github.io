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

I've built two VS Code extensions and thought it would be good to share my thoughts on the best way to building your *first extension*. Hopefully this will save you some time.

<!--more-->

## Easy to get started 

VS Code does a great job to help with getting started on [your first extension](https://code.visualstudio.com/api/get-started/your-first-extension){:target="\_blank" rel="noopener"}. They use a Yeoman generator to set up a basic hello world project which is configured to debug. Debugging is essential and has helped me learn about the VS Code API. All the basics are covered here and is worth reading the whole getting started section.

When you open the project find the main entry file `src/extension.ts` and you should see two functions `activate` `deactivate`. **Activate** is called when your extension is used, for example calling a command via the command palette. **Deactivate** is called when the extension is disabled or uninstalled.

## Things start to get a bit complicated

This is not to scare you but to prepare yourself to be a little patient. The [VS code API](https://code.visualstudio.com/api/references/vscode-api){:target="\_blank" rel="noopener"} is documented but not to the extent everything has example snippets, so there will be a bit of trial and error.

Key things to understand is VS Code extensions read certain properties in your project `package.json` to bind UI to your extension commands.

**Activation Events** is an array of strings that binds the event to a command id. Every command you define will have a string id. Event and command are split by a colon `:` e.g. "onCommand:awesomeExt.helloWorld". An activation event in your `package.json` might look like this:

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
  "activationEvents":["onCommand:awesomeExt.helloWorld"]
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

vscode.commands.registerCommand("awesomeExt.helloWorld", () => {
    vscode.window.showInformationMessage("Hello World!");
});
```

This is all in the generated projected, press F5 to launch the extension and search the command palette to find your hello world command.

VS Code have created helpful [code extension examples](https://github.com/Microsoft/vscode-extension-samples/){:target="\_blank" rel="noopener"} demonstrating the API on GitHub.
