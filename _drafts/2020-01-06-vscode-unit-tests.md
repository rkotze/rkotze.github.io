---
layout: post
title: "Unit test & mock your VS Code extension with Jest"
date: 2020-01-02 06:00:12 +0000
permalink: /coding/unit-test-mock-vs-code-extension-jest
category: coding
published: true
full_image_url: "https://user-images.githubusercontent.com/10452163/70393368-f0b53e80-19e0-11ea-85fd-e7b415a4a31b.jpg"
meta_description: >
  Examples using Jest for mocking and unit testing a VS Code extension
excerpt_separator: <!--more-->
tags: javascript vs-code unit-testing tutorial
---

An issue with unit testing <abbr title="Visual Studio Code">VS Code</abbr> extensions is the `vscode` dependency, which is needed to utilise the editor's features will error when running unit tests. Essentially it is a third party dependency which is out of your control, so the best thing to do is to mock the API. I will be using [Jest](https://jestjs.io/docs/en/mock-functions){:target="\_blank" rel="noopener"} and explaining how to use it's mocking features to handle the VS Code dependency.

<!--more-->

If you are just getting started with building your [first VS Code extension](https://code.visualstudio.com/api/get-started/your-first-extension){:target="\_blank" rel="noopener"}, the docs have a simple step-by-step guide to quickly get you coding.

Once you have set up your project you will notice it has the normal `package.json`. VS Code extensions will read from the `package.json` as a config to manage UI elements, so there will be some new properties which you will probably use when developing your extension. Since it's a standard `package.json` file you can install dependencies as usual. To set up **Jest**, install as a dev dependency and update the npm _test script_ to run Jest.

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

## Mock VS Code node module

Jest provides a few options for mocking but because we want to mock the whole of the _vscode node module_ the easiest option is to create a `__mock__` folder one the same level as the node_modules folder (typically the root folder) and add a file with the same name as the module to be mocked (`vscode.js`).

You won't need to import the module into your test file, the mock is automatically applied. Jest calls this [manual mocks](https://jestjs.io/docs/en/manual-mocks){:target="\_blank" rel="noopener"}.

The **great thing** about this approach is it keeps your test files clean from all the mock set up code, making it easy to reason about. The **minor downside** is new contributors to your codebase will need to be made aware of the `__mock__` folder because there no explicit connection that the VS Code module is mocked.

Below is the _mock_ of the _VS Code_ dependency. It's not the entire API so you should adjust it to your needs.

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

## Examples of using this VS Code mocked module

I'm going to take code examples from one of my open-source projects, [Git Mob for VS Code](https://github.com/rkotze/git-mob-vs-code){:target="\_blank" rel="noopener"} which I've used this approach in.

Below is an example of using adjusting the editor's status bar depending if _prepare-commit-msg_ Git hook is being used. Here you can see I don't need to import `vscode` module into my test file to mock it.

```javascript
// git-mob-hook-status.spec.js

const { hasPrepareCommitMsgTemplate } = require("../prepare-commit-msg-file");
const { gitMobHookStatus } = require("./git-mob-hook-status");

jest.mock("./../prepare-commit-msg-file");

describe("Hook or template status", function() {
  let mockContext;
  beforeAll(function() {
    mockContext = {
      subscriptions: []
    };
  });

  afterEach(function() {
    hasPrepareCommitMsgTemplate.mockReset();
  });

  it("using git template for co-authors", () => {
    hasPrepareCommitMsgTemplate.mockReturnValue(false);
    const statusBar = gitMobHookStatus({ context: mockContext })();
    expect(statusBar).toEqual(
      expect.objectContaining({
        text: "$(file-code) Git Mob",
        tooltip: "Using .gitmessage template"
      })
    );
  });

  it("using git prepare commit msg for co-authors", () => {
    hasPrepareCommitMsgTemplate.mockReturnValue(true);
    const statusBar = gitMobHookStatus({ context: mockContext })();
    expect(statusBar).toEqual(
      expect.objectContaining({
        text: "$(zap) Git Mob",
        tooltip: "Using prepare-commit-msg hook"
      })
    );
  });
});
```

```javascript
// git-mob-hook-status.js
const vscode = require("vscode");
const { hasPrepareCommitMsgTemplate } = require("../prepare-commit-msg-file");

function gitMobHookStatus({ context }) {
  const myStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    10
  );
  context.subscriptions.push(myStatusBarItem);
  return function() {
    myStatusBarItem.text = "$(file-code) Git Mob";
    myStatusBarItem.tooltip = "Using .gitmessage template";
    if (hasPrepareCommitMsgTemplate()) {
      myStatusBarItem.text = "$(zap) Git Mob";
      myStatusBarItem.tooltip = "Using prepare-commit-msg hook";
    }
    myStatusBarItem.show();
    return myStatusBarItem;
  };
}

exports.gitMobHookStatus = gitMobHookStatus;
```

You can view the source code here: 

- [git-mob-hook-status.spec.js](https://github.com/rkotze/git-mob-vs-code/blob/a440b57dc3f991105aba30b41e7d77af118de73a/src/status-bar/git-mob-hook-status.spec.js){:target="\_blank" rel="noopener"}
- [git-mob-hook-status.js](https://github.com/rkotze/git-mob-vs-code/blob/a440b57dc3f991105aba30b41e7d77af118de73a/src/status-bar/git-mob-hook-status.js){:target="\_blank" rel="noopener"}

### What if you want to check a `vscode` method is called?

You can import the `vscode` mock. Below we want to check `onDidSaveTextDocument` event is subscribed to when a user makes changes to the co-author file.

```javascript
const vscode = require("../__mocks__/vscode");

// ...
test("Reload co-author list when git-coauthors file saved", () => {
  reloadOnSave(coAuthorProviderStub);
  expect(vscode.workspace.onDidSaveTextDocument).toHaveBeenCalledWith(
    expect.any(Function)
  );
  // ...
});
// ...
```

As you can see it is the standard Jest mock API meaning you are not limited in any way with the **manual mock** approach, for example, you can also modify the implementation using `mockImplementation`.

See the full source file here for further examples:

- [reload-on-save.spec.js](https://github.com/rkotze/git-mob-vs-code/blob/baf86ae15bf359bf409a6a3bdc7ac74850640433/src/reload-on-save.spec.js){:target="\_blank" rel="noopener"}

One of the key benefits of writing **unit tests** is the quick feedback and if you like following the <abbr title="Test-driven development">TDD</abbr> approach this will be helpful for you to build your extension confidently.

If you have any feedback please write in the comments below or [tweet me](https://twitter.com/share?text=Unit test & mock your VS Code extension with Jest @richardkotze &url=https://www.richardkotze.com/coding/unit-test-mock-vs-code-extension-jest&hashtags=javascript,vscode,testing,tdd,agile){:target="\_blank" rel="noopener"}.