---
layout: post
title: "Build a CD Azure pipeline for your VS Code extension"
date: 2019-10-21 6:00:12 +0000
permalink: /coding/build-ci-azure-pipeline-vscode-extension
category: coding
full_image_url: https://user-images.githubusercontent.com/10452163/67111285-821be780-f1cc-11e9-93d4-eef2f262c9c6.jpg
meta_description: >
  Learn how to build a continuous delivery pipeline for your VS Code extension using Azure DevOps Pipeline
excerpt_separator: <!--more-->
---

For most of my published open source projects I've added a simple continuous integration (CI) pipeline using Travis CI. This time around I wanted a way to deploy a project after successful integration and try a new pipeline. Azure DevOps caught my attention. The goal here is to build, test and deploy my VS Code extension [Git Mob](https://marketplace.visualstudio.com/items?itemName=RichardKotze.git-mob){:target="\_blank" rel="noopener"} to the marketplace.

I'll provide **bite size** instructions to help you build a CI and continuous delivery (CD) pipeline for your VS Code extension on Azure DevOps platform. Following these steps I estimate it will take **15-25mins** to get it all working.

<!--more-->

![Build and test pipeline](https://user-images.githubusercontent.com/10452163/67111285-821be780-f1cc-11e9-93d4-eef2f262c9c6.jpg)

- [Setup a build and test](#setup-a-build-and-test)
- [Deploy to VS Code marketplace](#deploy-to-vs-code-marketplace)

### Setup a build and test

This section is about building the extension, running automated tests and creating a `.vsix` package, known as an 'artifact' in build pipelines. We will use this artifact later in the deployment stage. The artifact file name contains the version number from the `package.json`.

Let's get started:

1. Sign up to [Azure DevOps](https://azure.microsoft.com/en-gb/services/devops/){:target="\_blank" rel="noopener"} it's free.
1. Create a project. It can be customised at any time. If you have an open source project it will be worth making it public. This allows people to read the status and errors of the build pipeline. [Create a project](https://docs.microsoft.com/en-us/azure/devops/organizations/projects/create-project?view=azure-devops){:target="\_blank" rel="noopener"}
1. In your Git repository create a file called `.azure-pipelines/azure-pipelines.yml`. Below is the code for the file.
1. Copy the `azure-pipelines.yml` code. I've explained each of the steps as well.
1. Push these changes to your remote repository (GitHub)
1. The steps continue after the yml code

### The `azure-pipelines.yml` file steps explained

1. The `trigger` is set to `master` meaning that every push to master will trigger build.
1. `pool.vmImage` means it will build on an Ubuntu virtual machine (VM).
1. Customise the package name depending if built from master branch or pull request
1. Install project dependencies
1. Run unit tests
1. Globally install **vsce** which is used to build and deploy VS Code extensions. In this case it will build a **vsix** package, which will be used to deploy at a later stage.
1. Keep track of branch when needed for PRs
1. Copy generated files ready to be published artifacts
1. Finally publish files as artifacts. Now **ready** to deploy to VS Code marketplace.

Keep in mind that variables are not persisted between steps like `PACKAGE_VERSION`, they will need to be redefined. However, files are persisted through the build stage, which is why we create a `version.txt` file.

You will have noticed properties under _steps_ like _script_, _bash_ and _tasks_, these are types of _steps_. This is explained in the [Azure yaml schema](https://docs.microsoft.com/en-us/azure/devops/pipelines/yaml-schema?view=azure-devops&tabs=schema){:target="\_blank" rel="noopener"} documentation.

**`azure-pipelines.yml` file** to test and build a `.vsix` file to deploy.

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

### Create the pipeline in Azure DevOps

1. In your new Azure project, go to Pipelines on the left hand navigation.
1. On the top right click "New Pipeline".
1. Connect your repository (GitHub)
1. Under the configure your pipeline select "Existing Azure pipeline YAML file" (See figure 1 below)
1. Select the `.azure-pipelines/azure-pipelines.yml` from the dropdown. (See figure 2 below)
1. You should see the file loaded in. If it looks correct to you then click the "run" button on the top right to test it.

![Configure pipeline](https://user-images.githubusercontent.com/10452163/66701137-d0267c00-ecf0-11e9-9e90-f1040aa05840.png)
_Figure 1: select Existing Azure pipeline YAML file_

![Select file](https://user-images.githubusercontent.com/10452163/66701241-06183000-ecf2-11e9-9264-57ef6f093572.png)
_Figure 2: select azure-pipelines.yml file_

### Deploy to VS Code marketplace

I've created a separate post for the deployment pipeline to keep this post concise. Azure DevOps pipeline separates build pipelines and releases. See [deploy to VS Code marketplace](/coding/deploy-vscode-extension-azure-pipeline).

I hope this post helps you build a pipeline for your VS Code extension. Please comment below if you have questions or improvements to the post. If you did find it useful, please take a moment to share this via Twitter.
