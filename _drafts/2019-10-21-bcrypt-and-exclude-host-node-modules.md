---
layout: post
title: "Install Bcyrpt in Docker image and exclude host node_modules"
date: 2019-10-21 11:00:12 +0000
permalink: /coding/install-bcrypt-docker-image-exclude-host-node-modules
category: coding
full_image_url: https://user-images.githubusercontent.com/10452163/67439286-bdb01a80-f5ed-11e9-8d38-239911c53326.jpg
meta_description: >
  Learn how to build a Dockerfile to compile Bcrypt and don't link host node_modules with docker-compose
excerpt_separator: <!--more-->
---

This post will be covering two topics, installing _Bcrypt_ NodeJS as a package dependency and prevent linking node_modules from host machine to your docker container.

Using **Bcrypt** package to encrypt passwords comes with a minor challenge which is when installed it needs to be compiled to the operating system (OS) architecture using node-gyp, python 2.x. These prerequisite dependencies are needed to build an the app on a dev machine, which needs to be documented. However, _docker_ solves the need to communicate this in your "get started" documentation. Unfortunately this will create a problem of slow feedback loop during development.

<!--more-->

![Grey whale leaping out water](https://user-images.githubusercontent.com/10452163/67439286-bdb01a80-f5ed-11e9-8d38-239911c53326.jpg)
_Photo by Todd Cravens on Unsplash_

Every time there is a code change to the application the docker image will need a rebuild to check those changes. The rebuild is an additional step which will add time for every change to check, creating slow feedback loop and causing engineering frustration. This can be solved by using docker [named volumes](https://success.docker.com/article/different-types-of-volumes){:target="\_blank" rel="noopener"}, which will link your application files on your _host_ to the docker container.

The next challenge will be during development, where an engineer might be working on a different <abbr title="Operating System">OS</abbr> to the docker container. For example an engineer might be working on _Windows_ OS but the _docker image_ built is Linux. This will throw an **error** when running the app because Bcrypt dependency will be compiled against the host (Windows) but it will be running on Linux. Causing the error below:

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

This will install all the prerequisites needed for Bcrypt, then install node_modules and then _compile Bcrypt_. Afters it will remove the prerequisites to keep the docker image small as possible.

### Solution to second problem, Bcrypt compiled against different OS

You might want to setup a `docker-compose.yml` file with a `volumes` field which creates a named volume to link your host files to the container. If the host has a different <abbr title="Operating System">OS</abbr> to the container then the app will fail as explained above. The issue is _Bcrypt_ node_module is causing the error and we need a way to exclude the node_modules installed on the host machine from being linked to the container.

What is possible is to prevent the `node_modules` being linked from the host to the container is to use an **anonymous volume**.

Example snippet of `docker-compose` file

```yml
volumes:
  - ./your-host-app:/usr/src/app # named volume
  - /usr/src/app/node_modules # anonymous volume for node_modules only
```

Anonymous volumes reference the directory in the container and docker handles where the files are stored. The mount is outside of your project this keeps the `node_modules` intact that was built for the image.

Each time you run `docker-compose up` it will create another anonymous volume for newly created containers. Unfortunately running `docker-compose down` does not remove anonymous volumes however, using the flag `-v` would remove **named & anonymous**. If you _don't_ want to remove named volumes you can **stop** the containers, then run `docker-compose rm -vf` will remove only anonymous volumes.

This post is to help create a better engineering experience during development using docker. Comment below if you would like to add more to this. If you found it helpful, please take a moment to share on Twitter.
