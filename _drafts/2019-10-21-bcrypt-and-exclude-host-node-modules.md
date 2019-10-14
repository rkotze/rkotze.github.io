---
layout: post
title: "Install Bcyrpt in Docker image and exclude host node_modules"
date: 2019-10-14 12:00:12 +0000
permalink: /coding/install-bcrypt-docker-image-exclude-host-node-modules
category: coding
full_image_url: https://user-images.githubusercontent.com/10452163/51446144-cc3b6f80-1d05-11e9-87fa-96622a25eedc.gif
meta_description: >
  Learn how to build a Dockerfile to compile Bcrypt and don't link host node_modules with docker-compose
excerpt_separator: <!--more-->
---

This post will be covering two topics, installing Bcrypt NodeJS dependency and not linking project host node_modules to your docker container.

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