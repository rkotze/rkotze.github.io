---
layout: post
title:  Continuous integration, delivery and deployment
date:   2016-07-03 17:00:12 +0000
permalink: /continuous-integration-delivery-deployment
meta_description: >
 Succinct overview of continuous integration, delivery and deployment
---

Below is a succinct overview of what is continuous integration, delivery and deployment. The core benefit of following these practices allows developers to ship production code quicker to the user. This should help provide a quicker feedback loop.

### Continuous integration

Developers integrate code often as possible to the main branch at least once a day. The build is checked by an automated build which run tests and information is fed back fast on its state. Any broken changes should be fixed as soon as possible. 

Objective:

**Reduces risk** because you are committing regularly into the main branch, this should encourage smaller commits making it easy to integrate. Committing into the main branch does required the project to build successfully, pass unit tests and possibly other tests like code style.

**Communication tool** among developers because of regular commits the developers across teams can see the changes to the code base.

**Find bugs quicker** with regular integration into the main branch bugs are discovered sooner and since the changes are small they should be easy to fix.

### Continuous Delivery

After CI is successful the project is deployed to an identical production environment to ensure it works as expected and with external services it might use. The deployment to production is controlled by a manual action like a click of a button. This is to allow business to review the work done and decide if it should be released.

### Continuous Deployment

Recent changes to the main branch progresses successfully through the build and testing stages of the pipeline to then be released to production.

More reading:

- [Martin Fowler CI](http://www.martinfowler.com/articles/continuousIntegration.html){:target="_blank"}
- [Martin Fowler CD](ttp://martinfowler.com/bliki/ContinuousDelivery.html){:target="_blank"}