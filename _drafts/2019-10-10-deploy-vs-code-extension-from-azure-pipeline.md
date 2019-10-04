---
layout: post
title: "Deploy VS code extension via Azure pipeline"
date: 2019-09-26 12:00:12 +0000
permalink: /coding/deploy-vscode-extension-azure-pipeline
category: coding
full_image_url: https://user-images.githubusercontent.com/10452163/66151454-418a6e80-e60f-11e9-99a4-621c67d20c8c.jpg
meta_description: >
  Learn how deploy your VS code extension to the marketplace via Azure pipeline
excerpt_separator: <!--more-->
---

This post is to help developers who are new to Azure DevOps releases and deploying a VS Code extension. Azure pipelines come with lots of great options but it can be difficult to know what to do to achieve your goal. The goal in this case is to deploy my VS Code extension, [Git Mob](https://marketplace.visualstudio.com/items?itemName=RichardKotze.git-mob){:target="\_blank"} to the marketplace.

I'll provide **bite size** instructions to help you build a release for your VS Code extension using Azure DevOps platform. This will take about **5-10mins**.

<!--more-->

![vs-code-release](https://user-images.githubusercontent.com/10452163/66151454-418a6e80-e60f-11e9-99a4-621c67d20c8c.jpg)
_Build a release pipeline to VS Code marketplace_

This article assumes you have built a `.vsix` artifact from am Azure DevOps pipeline. If not, I will be posting fairly soon on how to make a build pipeline for your VS Code extension. I wanted to keep these posts about Azure pipeline separate, to focus on small specific tasks.

### Deploy to VS Code marketplace

We will create a "release" to deploy the built artifact to the marketplace. The YAML example at the end of the steps illustrates the commands needed to release the artifact via Azure DevOps pipeline.

![Azure release pipeline UI screenshot](https://user-images.githubusercontent.com/10452163/66149404-f1111200-e60a-11e9-860e-d6531bc2bd3b.png)
_Azure release pipeline UI showing areas covered in these steps_

1. In the left hand navigation bar under Pipelines select Releases
1. Open the **New** dropdown and select **New release pipeline**
1. You will be asked to select a template, unfortunately there is not one for deploying extensions to the marketplace. Select **Empty job**.
1. You will only need one stage, name it what you like.
1. Select **Add an artifact** box
1. Source type is **Build** and Source will be the first item in the dropdown. It will be the name of your Git repository.
1. Default version is set to **latest** but you can of course change this.
1. Click the **Add** button when you're ready.
1. In stages box click the small link **1 Jobs, 0 task**.
1. On **Agent Job** click the plus button and search for **"bash"** task. Then click add.
1. **Type** select **Inline**
1. Copy the commands from the **YAML example** below starting from `sudo ...` to `.vsix`
1. Under the **Advanced** tab, working directory click the ellipsis (...) button on the right and select the folder which contains the `.vsix` artifact file.
1. Using your marketplace **Personal Access Token** (PAT) we will set an environment variable called `MARKET_KEY`. [Get & save <abbr title="Personal Access Token">PAT</abbr> securely](#get--save-pat-securely)
1. In the environment variables tab add **name** `MARKET_KEY` and **value** `$(nameOfSecureVariable)`
1. Ensure you save these changes and you should be ready to **"create a release"**.

### Execute your release pipeline

- To run your new release pipeline click the **create release** button in the top right <span class="noWidth"><img src="https://user-images.githubusercontent.com/10452163/66148819-afcc3280-e609-11e9-974d-3c76aca9cebe.png" alt="create release button" /></span>
- A side menu will appear, all the fields are optional so you can click **create**

**YAML example** showing how to release you VS Code extension to the marketplace.

Important points:

- `vsce publish` is the app & command to deploy to VS Code marketplace
- `-p $MARKET_KEY` send your <abbr title="Personal Access Token">PAT</abbr> to authorise publishing
- `--packagePath git-mob-$PACKAGE_VERSION.vsix` the extension package to publish

```yml
steps:
  - bash: |
      sudo npm install -g vsce

      PACKAGE_VERSION=$(cat version.txt)

      vsce publish -p $MARKET_KEY --packagePath git-mob-$PACKAGE_VERSION.vsix
    workingDirectory: "$(System.DefaultWorkingDirectory)/_rkotze.git-mob-vs-code"
    displayName: Deploy
    env:
      MARKET_KEY: $(vscekey)
```

Here is the [Git Mob release pipeline](https://dev.azure.com/TinkerTaylor/VS%20code%20extensions/_release?definitionId=1&view=mine&_a=releases) for reference.

### Get & save <abbr title="Personal Access Token">PAT</abbr> securely

1. To publish to the marketplace you will need a Personal Access Token which is explained here on [publishing extensions](https://code.visualstudio.com/api/working-with-extensions/publishing-extension){:target="\_blank"}.
1. Once you have a key, it will need to be stored privately so it can be used in the release pipeline without it being revealed in the build log. Ensure your work is saved and now let's store that token.
1. Click the **variables** tab on the top left.
1. Insure Pipeline variables is selected on the left and click the **+ Add** button.
1. Add a name e.g. "vscekey" and the value is your <abbr title="Personal Access Token">PAT</abbr>. Ensure the **padlock is locked** to make it a **secret**.
1. Your secret variable is now ready to be accessed by the release pipeline.
1. Finish the remaining steps above to complete the release pipeline.

I hope this has helped you to deploy your extension. Please comment below if this was useful or you came across an issue which could help others.
