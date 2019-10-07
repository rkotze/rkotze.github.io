---
layout: post
title: "Build a CD Azure pipeline for your VS Code extension"
date: 2019-09-26 12:00:12 +0000
permalink: /coding/build-CI-azure-pipeline-vscode-extension
category: coding
full_image_url: https://user-images.githubusercontent.com/10452163/51446144-cc3b6f80-1d05-11e9-87fa-96622a25eedc.gif
meta_description: >
  Learn how to build a continuous delivery pipeline your VS Code extension using Azure DevOps Pipeline
excerpt_separator: <!--more-->
---

For most of my published open source projects I've added a simple continuous integration pipeline using Travis CI. This time around I wanted a way to deploy a project after successful integration and try a new pipeline. Azure DevOps caught my attention. The goal here is to build, test and deploy my VS Code extension [Git Mob](https://marketplace.visualstudio.com/items?itemName=RichardKotze.git-mob){:target="\_blank"} to the marketplace.

I'll provide **bite size** instructions to help you build a CI and continuous delivery (CD) pipeline for your VS Code extension on Azure DevOps platform. Following these steps I estimate it will take **15-25mins** to get it all working.

<!--more-->

- [Setup a build and test](#setup-a-build-and-test)
- [Deploy to VS Code marketplace](#deploy-to-vs-code-marketplace)
- [What I like Azure pipeline](#what-i-like-azure-pipeline)

### Setup a build and test

This section is about building the extension, running automated tests and building a `.vsix` package as an artifact to be used in the deployment stage. The artifact file name contains the version number from the `package.json`.

1. Sign up to [Azure DevOps](https://azure.microsoft.com/en-gb/services/devops/){:target="\_blank"} it's free.
1. Create a project. It can be customised at any time. If you have an open source project it will be worth making it public. This allows people to read the status and errors of the build pipeline. [Create a project](https://docs.microsoft.com/en-us/azure/devops/organizations/projects/create-project?view=azure-devops){:target="\_blank"}
1. In your Git repository create a file called `.azure-pipelines/azure-pipelines.yml` to push up. Below is the code for the file.
1. Create a new build pipeline, connect your repository and reference the above file.

### The `azure-pipelines.yml` file steps explained

This is in reference to each point under the section `steps:`.

1. Customise the package name depending if built from master branch or pull request
1. Install project dependencies
1. Run unit tests
1. Globally install **vsce** which is used to build and deploy VS Code extensions. In this case it will build a **vsix** package, which will be used to deploy at a later stage.
1. Keep track of branch when needed for PRs
1. Copy generated files ready to be published artifacts
1. Finally publish files as artifacts. Now **ready** to deploy to VS Code marketplace.

Worth noting _script_, _bash_ and _tasks_ are essentially types of _steps_. This will explain the [Azure yaml schema](https://docs.microsoft.com/en-us/azure/devops/pipelines/yaml-schema?view=azure-devops&tabs=schema){:target="\_blank"}

`azure-pipelines.yml` file to test and build a `.vsix` file to deploy.

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

### Deploy to VS Code marketplace

Since Azure DevOps pipeline separates build pipelines and releases I thought I would make a separate post for deployments. See [deploy to VS Code marketplace](/coding/deploy-vscode-extension-azure-pipeline).

### Why have a delivery pipeline?

Generally a build and test pipeline give you confidence that your app is functioning as you expect it. Including a delivery step will help reduce the over head of remembering the commands to run to release into production. However, there is a lot more about the importance of having a pipeline, you can read more from my post on [CI and continuous delivery (CD)](/continuous-integration-delivery-deployment)

### What I like Azure pipeline

As far as Azure pipelines are concerned I thought it would be worth trying to see how well it worked and the benefits of using it.

- It's free and you get a lot of good features for the free tier
- You can provide a configured yaml file which manages a good variety of steps. This allows you to version control your pipeline, which is always handy.
- The pipeline UI is clean and simple to navigate
- You can construct the pipeline in the UI with a load of predefined tasks then copy the yaml out to your project.
- I found the pipeline configuration really flexible which in a way is good/bad
- Lots of documentation about specific features and a few get started tutorials which I found handy.
