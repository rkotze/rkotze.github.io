---
layout: post
title: "ideas"
date: 2019-10-12 12:00:12 +0000
permalink: /ideas
category: coding
excerpt_separator: <!--more-->
---

See all the ideas.

<!--more-->

# Docker-compose do not use host node_modules

Using **Bcrypt** NodeJS package to encrypt passwords comes with a minor challenge which is when installed it needs to be compiled using node-gyp, python 2.x and compiled to the operating system (OS) architecture. One frustration could be during development. A developer might be working on Windows but the docker container which the app runs against is a Linux system. This will throw an **error** when running the app.

```
Error: /app/node_modules/bcrypt/lib/binding/bcrypt_lib.node: invalid ELF header
```

What you can run in your Dockerfile is this:

```docker
RUN apk add --no-cache make gcc g++ python && \
  npm install && \
  npm rebuild bcrypt --build-from-source && \
  apk del make gcc g++ python
```

This will install all the dependencies needed to compile Bcrypt and then remove the afters to keep the docker image small as possible.

Another issue is if use have setup a named volume to link your host files to the container. If the host has a different <abbr title="Operating System">OS</abbr> to the container then the app will fail with the above error.

The benefit of the volume is you can see how the app works when in the container as you update the files which is a lot faster than stopping the container, rebuilding the image and starting the container again.

What is possible is to prevent the node_modules being linked from the host to the container by using an anonymous volume as well.

Example snippet of docker-compose file

```yml
volumes:
  - ./your-host-app:/usr/src/app # named volume
  - /usr/src/app/node_modules # anonymous volume for node_modules only
```

Anonymous volumes reference the directory in the container and docker handles where the files are stored. The mount is outside of your project. This is good for using node_modules that was built for the image.

Docker compose down does not remove anonymous volumes but would remove named & anonymous. However, stopping the containers and using `docker-compose rm` will remove only anonymous volumes.

# Graphql server validation errors

Make it part of the mutation payload object.

# Implement JWT authentication for GraphQL server

- Express middleware
- The role of access token and refresh tokens

# Azure pipeline thoughts

### Why have a delivery pipeline?

Generally a delivery pipeline gives you confidence that your app is functioning as you expect it and preventing regression. Including a delivery step will help reduce the over head of remembering the commands to run to release into production. However, there is a lot more about the importance of having a pipeline, you can read more from my post on [CI and continuous delivery (CD)](/continuous-integration-delivery-deployment)

### What I like Azure pipeline

As far as Azure pipelines are concerned I thought it would be worth trying to see how well it worked and the benefits of using it.

- It's free and you get a lot of good features for the free tier
- You can provide a configured yaml file which manages a good variety of steps. This allows you to version control your pipeline, which is always handy.
- The pipeline UI is clean and simple to navigate
- You can construct the pipeline in the UI with a load of predefined tasks then copy the yaml out to your project.
- I found the pipeline configuration really flexible which in a way is good/bad
- Lots of documentation about specific features and a few get started tutorials which I found handy.
