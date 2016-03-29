---
layout: post
title:  How to change the hostname on Amazon Linux machine
date: 2012-10-24 17:00:12 +0000
permalink: 2012-10-24-change-the-hostname-on-amazon-linux-machine
category: top-tips
meta_description: >
 How to change the hostname on Amazon Linux machine and keep that name when its restarted.
---

To change the _hostname_ of a machine you can use the following command: "hostname mynewhostname". - With out the quotes. Worth noting is this does not affect the DNS and this is only for the current session. By rebooting the server, this information will reset to whatever Amazon machine is configured to.

If you want to make the _hostname_ permanent then you need to edit the network file.

If you are using **Linux**:&nbsp;this command `sudo vim /etc/sysconfig/network`, of course you can use what ever editor you like. In this file there is an attribute called HOSTNAME that you need to change.

If you are using **Ubuntu**: this command `sudo vim /etc/hostname` and replace the string of text to your new hostname.
  