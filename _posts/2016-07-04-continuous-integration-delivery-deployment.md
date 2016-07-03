---
layout: post
title:  Continuous integration, delivery and deployment
date:   2016-07-02 17:00:12 +0000
permalink: /continuous-integration-delivery-deployment
category: coding
published: false
meta_description: >
 Simple overview of continuous integration, delivery and deployment
---


### Continuous integration

Commit your code often as possible to the main branch at least once a day, ensure it builds and passes tests. Feedback is give fast and typically ran on a build server. 

Objective:

**Reduces risk** because you are committing regularly into the main branch should encourage smaller commits making it easy to integrate. Committing into the main branch does required the project to build successfully, pass unit tests and possibly other tests like code style.

**Communication tool** with regular commits developers across teams working on the same code base can see what has changed.

- http://www.martinfowler.com/articles/continuousIntegration.html

### Continuous Delivery

Code is deployed to a production like environment to ensure it works as expected and with external services it might use. The deployment to production is controlled by a manual action like a click of a button. This is to allow business to decide if it should be released.

- http://martinfowler.com/bliki/ContinuousDelivery.html

### Continuous Deployment

Recent changes to the main branch progresses successfully through the build and testing stages of the pipeline is released to production. 
- Automatic rollback is strongly recommended for CDel and CDep.