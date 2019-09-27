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

I struggled with Azure pipelines because of the amount of options. While it's great to have these options it's difficult to know what to do to achieve your goal. The goal in this case to publish my extension to VS code marketplace. The initial setup is super easy and Azure has done a great job there and there is plenty of documentation.

I'll provide a step by step instructions to help you build and deploy your VS code extension via Azure pipeline.

<!--more-->

- [Setup a build and test]()
- [Deploy to VS Code marketplace]()
- [Why have a delivery pipeline?]()
- [Why use Azure pipeline?]()

### Setup a build and test

1. Sign up to [Azure devops](https://azure.microsoft.com/en-gb/services/devops/){:target="\_blank"}
1. Create a project which you can customise. If you have an open source project it will be worth making it public. Which means people can read status and view errors of the build pipeline. [Create a project](https://docs.microsoft.com/en-us/azure/devops/organizations/projects/create-project?view=azure-devops){:target="\_blank"}
1. Create a new build pipeline and connect with your GitHub repository. (Or where ever you are hosting your repository)
1. Create a folder and file called `.azure-pipelines/azure-pipelines.yml`

The yml file below will

1. Customise the package name depending if building on master branch or is a pull request
1. Install project dependencies
1. Run unit tests
1. Globally install **vsce** which is used to build and deploy VS code extension. In this case it will build a **vsix** package. This will be used to deploy later.
1. Keep track of branch if needed
1. Stage generated files ready to be published artifacts
1. Finally publish files as artifacts. Now **ready** to deploy to VS Code marketplace.

```yml
# CI and PR build script

trigger:
  - master

pool:
  vmImage: ubuntu-16.04

steps:
  # for convenience, we tag CI-produced packages with a version number
  # pointing to the commit which was built. for PRs, also include the PR #.
  - bash: |
      PACKAGE_VERSION=$(node -p "require('./package.json').version")

      if [ -n "$SYSTEM_PULLREQUEST_PULLREQUESTNUMBER" ]; then
        VERSION_STRING=${PACKAGE_VERSION}-pr-${SYSTEM_PULLREQUEST_PULLREQUESTNUMBER}-$(git rev-parse --short HEAD)
      else
        VERSION_STRING=${PACKAGE_VERSION}-ci-$(git rev-parse --short HEAD)
      fi

      npm --no-git-tag-version version $VERSION_STRING
      echo "##vso[build.updatebuildnumber]${VERSION_STRING}_${BUILD_BUILDID}"
      echo "$PACKAGE_VERSION" > version.txt
    displayName: Set version number of package and build

  - script: npm install
    displayName: npm install

  - script: npm run test
    displayName: Run unit tests

  # Acquire the `vsce` tool and use it to package
  - script: |
      sudo npm install -g vsce
      vsce package
    displayName: Create VSIX

  # For releasable builds, we'll want the branch
  # Expects that a 'version.txt' has been laid down by a previous step
  - bash: |
      echo $(Build.SourceBranch) | sed "s|refs/[^/]*/||" > branch.txt
      PACKAGE_VERSION=$(cat version.txt)
      VERSION_REGEX="## $(echo $PACKAGE_VERSION | sed 's/\./\\./g')"
    displayName: Get branch

  # Choose files to publish
  - task: CopyFiles@2
    displayName: Stage VSIX for publishing
    inputs:
      contents: |-
        *.vsix
        version.txt
        branch.txt
      targetFolder: $(Build.ArtifactStagingDirectory)

  # Publish files as an artifact
  - task: PublishPipelineArtifact@1
    displayName: Publish VSIX
    inputs:
      artifact: git-mob-vs-code
      targetPath: $(Build.ArtifactStagingDirectory)
```

### Why have a delivery pipeline?

Generally a build and test pipeline give you confidence that your app is functioning as you expect it. It will also do the same for contributors new to the project. When you include a delivery step it helps by reducing the over head of remembering what commands to run to release into production.

### Why use Azure pipeline?

As far as Azure pipelines are concerned I thought it would be worth trying to see how well it worked and the benefits of using it.

- It's free and you get a lot of good features for the free tier
- You can provide a configured yaml file which manages a good variety of steps. This allows you to version control your pipeline, which is always handy.
- The pipeline UI is clean and simple to navigate
- You can construct the pipeline in the UI with a load of predefined tasks then copy the yaml out to your project.
- I found the pipeline configuration really flexible which in a way is good/bad
- Lots of documentation about specific features and a few get started tutorials which I found handy.
