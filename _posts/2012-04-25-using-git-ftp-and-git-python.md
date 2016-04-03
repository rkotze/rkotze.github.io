---
layout: post
title:  Using GIT FTP and GIT Python
date:   2012-04-25 17:00:12 +0000
permalink: /top-tips/using-git-ftp-and-git-python
category: top-tips
meta_description: >
 Useful tool git ftp to control the version uploaded to live server.
---

GIT is an excellent version control system with its GUI GIT Extensions. Something I was thinking about was finding a way to push only the project file changes to the live server. Ideally being able to choose a committed version to push live, or roll back too. There are ways like bundling the project into a .zip or .tar file and deploying it.

I was searching the web and found this useful python script [GIT – FTP][1]. This script looks at your&nbsp;repository to upload new files and ones that have changed. It has some helpful features like push a specific commit, so you could use this to roll back if needed or you can upload a specific branch rather than the default master.

### How to setup

* Obvious first step, install python.
* Then install the [setup tools][2]. If on windows download one of the relevant .exe files. This will give you the "easy install" tool which you must added to your path.
* Then you can install Git Python using the command "_easy_install gitpython_". If this fails you can install in manually by [downloading it][3] and running the setup file. &gt;_python setup.py install_.
* Then one thing you will need to check is if GIT is added to your path. If not use this "_C:Program Files (x86)Gitbin_", it should refer to the GIT bin if you have it installed somewhere else.
* Now you are ready to roll, place the git-ftp.py into your root file for your project. Probably want to add it to your git ignore file.
* Follow the instructions for adding your FTP details and run the file.
* For an existing project I recommend you upload to the server a `git-rev.txt` file containing SHA1 of the commit which matches what exists on the server. Else when you upload the project all files will be overwitten and files that don't exist it the commit will be deleted.

### Top Tip

Open the CMD and navigate to the git-ftp file, use this command "_git-ftp.py -h_" to see the list of commands.

[1]: https://github.com/ezyang/git-ftp
[2]: http://pypi.python.org/pypi/setuptools#using-setuptools-and-easyinstall
[3]: http://gitorious.org/git-python