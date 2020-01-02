---
layout: post
title: "Unit test your VS Code extension with Jest"
date: 2020-01-02 06:00:12 +0000
permalink: /coding/unit-test-vs-code-extension-jest
category: coding
published: true
image: "https://user-images.githubusercontent.com/10452163/70393368-f0b53e80-19e0-11ea-85fd-e7b415a4a31b.jpg"
meta_description: >
  Examples using Jest for mocking and unit testing a VS Code extension
excerpt_separator: <!--more-->
tags: javascript vs-code unit-testing
---

An issue with unit testing vscode extensions is the `vscode` dependency, which is needed to utilise the editors features will error when running unit tests. Essentially it is a third party dependency which is out of your control, so the best thing to do mock the API. I will be using [Jest](https://jestjs.io/docs/en/mock-functions){:target="\_blank" rel="noopener"} and explaining how to use it's mocking features to handle the VS Code dependency.

<!--more-->

If you are just getting started with building your [first VS Code extension](https://code.visualstudio.com/api/get-started/your-first-extension){:target="\_blank" rel="noopener"}, the docs have a simple step-by-step guide to quickly get you coding.

Once you have set up your project you will notice it has the normal `package.json`. VS Code extensions does read from the `package.json` as a config to manage UI elements, so you may notice some new properties and add new ones when developing your extension. To set up Jest install the dev dependency as usual and update the npm _test script_ to run Jest.

```bash
npm i -D jest
```

```json
{
  "scripts": {
    "test": "jest"
  }
}
```

### Set up <abbr title="Visual Studio Code">VS Code</abbr> Jest mock

Jest provides a few options for mocking but because we want to mock common parts of the vscode API the easiest option is to create a `__mock__` folder in the project root folder and add a file with the same name as the module to be mocked (`vscode.js`).

Below is a _mock_ of the _vscode_ dependency. It's not the entire API so you should adjust it to your needs.

```javascript
// vscode.js
const languages = {
  createDiagnosticCollection: jest.fn()
};

const StatusBarAlignment = {};

const window = {
  createStatusBarItem: jest.fn(() => ({
    show: jest.fn()
  })),
  showErrorMessage: jest.fn(),
  showWarningMessage: jest.fn(),
  createTextEditorDecorationType: jest.fn()
};

const workspace = {
  getConfiguration: jest.fn(),
  workspaceFolders: [],
  onDidSaveTextDocument: jest.fn()
};

const OverviewRulerLane = {
  Left: null
};

const Uri = {
  file: f => f,
  parse: jest.fn()
};
const Range = jest.fn();
const Diagnostic = jest.fn();
const DiagnosticSeverity = { Error: 0, Warning: 1, Information: 2, Hint: 3 };

const debug = {
  onDidTerminateDebugSession: jest.fn(),
  startDebugging: jest.fn()
};

const commands = {
  executeCommand: jest.fn()
};

const vscode = {
  languages,
  StatusBarAlignment,
  window,
  workspace,
  OverviewRulerLane,
  Uri,
  Range,
  Diagnostic,
  DiagnosticSeverity,
  debug,
  commands
};

module.exports = vscode;
```

- Example of a mock in action
