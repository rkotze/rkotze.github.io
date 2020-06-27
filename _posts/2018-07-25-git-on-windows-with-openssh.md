---
layout: post
title:  Connecting to GitHub with OpenSSH on Windows
date:   2018-07-24 08:00:12 +0000
permalink: top-tips/connecting-github-with-openssh-windows
category: top-tips
published: true
image: retro-arcade-gaming.jpg
meta_description: >
 How to setup OpenSSH with Git on Windows using commander
excerpt_separator: <!--more-->
tags: git
---

Here are the steps to setup **OpenSSH** with **Git** to connect to a repository on GitHub.

I use Windows as my main OS and **Cmder** as my console emulator. Installing the full version you will get _Git for Windows_ which has loads of Unix commands available in your PATH including OpenSSH. The version of Cmder I'm using is 1.3.0.

<!--more-->

An alternative option is to use [Putty for Windows command line](/top-tips/git-on-windows-in-command-line).

![Retro arcade showing Pacman](/images/retro-arcade-gaming.jpg)
_Photo by Rebecca Oliver on Unsplash_

## Steps for connecting to GitHub with SSH:

See the troubleshooting section below if you have any issues with the steps.

1. `ssh-keygen -t rsa -C "your@email.here"` - Three additional question from the command:
  - Path and file name of where you want to put the key. The default will be added to your user profile `.ssh` directory
  - Create a passphrase (this can be left empty)
  - Enter passphrase again
1. Ensure your `ssh-agent` has started, by running the `ssh-agent` command
1. Add your private key using `ssh-add ~/.path_to/private_key_file`
1. You can confirm it has been added using `ssh-add -l`. This will show a list of added keys
1. Add your public key to GitHub `settings -> SSH and GPG keys`
  - Open your public key file and copy/paste into GitHub SSH Keys

**Important**: You will need to let Git know the SSH client to use. Add/Update the environment variable `GIT_SSH` with the path to OpenSSH client e.g. `C:\cmder\vendor\git-for-windows\usr\bin\ssh.exe`

With this setup, you **should now be able to push/pull/clone** a GitHub repository.

You might get asked when connecting for the first time:

> The authenticity of host 'github.com (ip.ad.dre.ss)' can't be established. <br/>
> RSA key fingerprint is SHA256:<rsaFingerPrint>. <br />
> Are you sure you want to continue connecting (yes/no)?

You decide, but "yes" if you want to connect and push your code.

## Troubleshooting

### `ssh-agent`

Error message: **unable to start ssh-agent service, error :1058**

> I found that the service was disabled. Type in services in the start menu and open the Services app. Look for **OpenSSH Authentication Agent** and set it to Automatic.

### `ssh-add path/to/private_key`

Error message: **Could not open a connection to your authentication agent.**

> This might be `ssh-add` does not know where the `ssh-agent` is to run. Cmder has a start up script you can use for every new terminal. In `cmder/config/user-profile.cmd` add or uncomment the line `call "%GIT_INSTALL_ROOT%/cmd/start-ssh-agent.cmd"`

### Git push/pull/clone

FATAL ERROR: **Disconnected: No supported authentication methods available (server sent: publickey)**

> You need to add/update the environment variable `GIT_SSH` to the correct path of your SSH client

<!-- If you want to use [PuTTY with Git](/top-tips/git-on-windows-in-command-line) checkout out my previous post. -->

Useful links:

- [Git for windows](https://gitforwindows.org/){:target="\_blank"}
- [OpenSSH](https://www.openssh.com/){:target="\_blank"}
- [Cmder](http://cmder.net/){:target="\_blank"}
