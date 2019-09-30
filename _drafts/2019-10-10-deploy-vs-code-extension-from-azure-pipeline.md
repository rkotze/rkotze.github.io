---
layout: post
title: "Build & Deploy VS code extension via Azure pipeline"
date: 2019-09-26 12:00:12 +0000
permalink: /coding/deploy-vscode-extension-azure-pipeline
category: coding
full_image_url: https://user-images.githubusercontent.com/10452163/51446144-cc3b6f80-1d05-11e9-87fa-96622a25eedc.gif
meta_description: >
  Learn how to build and deploy your VS code extension via Azure pipeline
excerpt_separator: <!--more-->
---

I struggled with Azure pipelines because of the amount of options. While it's great to have these options it's difficult to know what to do to achieve your goal. The goal in this case to deploy my extension, [Git Mob](https://marketplace.visualstudio.com/items?itemName=RichardKotze.git-mob){:target="\_blank"} to VS Code marketplace.

I'll provide **bite size** instructions to help you build a release for your VS Code extension using Azure DevOps platform. This will take about **5-10mins**.

<!--more-->

### Deploy to VS Code marketplace

The next stage is to take the built artifact and deploy it. The YAML example is only to view the commands to release the artifact but to build a release you need the create that in the Azure DevOps app.

1. In the left hand navigation bar under Pipelines select Releases
1. Open the **New** dropdown and select **New release pipeline**
1. You will be asked to select a template, unfortnately there is not one for deploying extensions to the marketplace. Select **Empty job**.
1. You will only need one stage, name it what you like.
1. Select **Add an artifact** box
1. Source type is **Build** and Source will be the first item in the dropdown. It will be the name of your Git repository.
1. Default version is set to **latest** but you can of course change this.
1. Click the **Add** button when you're ready.
1. In stages box click the small link **1 Jobs, 0 task**.
1. On **Agent Job** click the plus button and search for "bash" task. Then click add.
1. **Type** select **Inline**
1. Copy the commands from the yaml example below starting from `sudo ...` to `.vsix`
1. Under the **Advanced** tab, working directory click the ellipsis (...) button on the right and select the folder which has a "(Build)" suffix.
1. We need to set an environment variable called `MARKET_KEY`.

YAML example showing how to release you VS Code extension to the marketplace. 

```yml
steps:
  - bash: |
      sudo npm install -g vsce

      PACKAGE_VERSION=$(cat git-mob-vs-code/version.txt)

      vsce publish -p $MARKET_KEY --packagePath git-mob-vs-code/git-mob-$PACKAGE_VERSION.vsix
    workingDirectory: '$(System.DefaultWorkingDirectory)/_rkotze.git-mob-vs-code'
    displayName: Deploy
    env:
      MARKET_KEY: $(vscekey)
```

