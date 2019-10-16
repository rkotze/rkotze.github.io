---
layout: post
title: "Install Bcyrpt in Docker image and exclude host node_modules"
date: 2019-10-16 11:00:12 +0000
permalink: /coding/install-bcrypt-docker-image-exclude-host-node-modules
category: coding
full_image_url: https://user-images.githubusercontent.com/10452163/51446144-cc3b6f80-1d05-11e9-87fa-96622a25eedc.gif
meta_description: >
  Learn how to build a Dockerfile to compile Bcrypt and don't link host node_modules with docker-compose
excerpt_separator: <!--more-->
---

This post will be covering two topics, installing _Bcrypt_ NodeJS as a package dependency and not linking project host node_modules to your docker container.

Using **Bcrypt** package to encrypt passwords comes with a minor challenge which is when installed it needs to be compiled using node-gyp, python 2.x and compiled to the operating system (OS) architecture. This means a few prerequisite dependencies are needed to build an the app on a dev machine. However, _docker_ solves the need to communicate this in your "get started" documentation.

This does mean that every time you change your application code you will need to rebuild the docker image to check those changes. The rebuild is an additional step which will add time for every change to check, creating slow feedback loop and causing engineering frustration. This can be solved by using docker [named volumes](https://success.docker.com/article/different-types-of-volumes){:target="\_blank" rel="noopener"}, which will link your application files on your _host_ to the docker container. Unfortunately this will lead to another issue for cross-platforms.

<!--more-->

The next challenge would be during development, an engineer might be working on _Windows_ OS but the _docker image_ built is Linux. This will throw an **error** when running the app because Bcrypt dependency will be compiled against the host (Windows) but it will be running against Linux. Causing the error below:

```
Error: /app/node_modules/bcrypt/lib/binding/bcrypt_lib.node: invalid ELF header
```

### Solution to first problem, setup Dockerfile to build Bcrypt 

What you can run in your _Dockerfile_ is this:

```docker
RUN apk add --no-cache make gcc g++ python && \
  npm install && \
  npm rebuild bcrypt --build-from-source && \
  apk del make gcc g++ python
```

This will install all the prerequisites needed to for Bcrypt, then install your `package.json` dependencies and then _compile Bcrypt_. Afters it will remove the prerequisites to keep the docker image small as possible.


### Solution to second problem, Bcrypt compiled against different OS

You might have setup a `docker-compose.yml` file with a `volumes` field which creates a named volume to link your host files to the container. If the host has a different <abbr title="Operating System">OS</abbr> to the container then the app will fail as explained above. The issue is Bcrypt node_module is causing the error and we need a way to exclude the node_modules installed on the host machine from being linked to the container.

What is possible is to prevent the `node_modules` being linked from the host to the container is to use an **anonymous volume**.

Example snippet of `docker-compose` file

```yml
volumes:
  - ./your-host-app:/usr/src/app # named volume
  - /usr/src/app/node_modules # anonymous volume for node_modules only
```

Anonymous volumes reference the directory in the container and docker handles where the files are stored. The mount is outside of your project. This is good for using `node_modules` that was built for the image.

Each time you run `docker-compose up` it will create another anonymous volume for newly created containers. Unfortunately running `docker-compose down` does not remove anonymous volumes but using the flag `-v` would remove **named & anonymous**. If you don't want to remove named volumes you can **stop** the containers, then run `docker-compose rm -vf` will remove only anonymous volumes.

This post is to help create a better engineering experience during development using docker. Comment below if you would like to add more to this. If you found it helpful, please take a moment to share on Twitter.