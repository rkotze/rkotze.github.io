---
layout: post
title: "Stubbing Reflux and SuperAgent with Sinon"
date: 2016-03-06 12:39:21 +0000
permalink: top-tips/stubbing-reflux-and-superagent-with-sinon/
category: top-tips
tags: javascript unit-testing
---

To follow on from the testing post I wrote on Findmypast tech blog for [stubbing dependances in commonJS](http://tech.findmypast.com/stubbing-dependencies-in-commonjs/) using proxyquire.

I thought it would be a worth sharing how I have gone about unit testing my code when using [Reflux](https://github.com/reflux/refluxjs) and [SuperAgent](https://visionmedia.github.io/superagent/) libraries. The reason is to help get started and how to go about stubbing the superagent library. Hopefully this will help make that start a bit easier.

If the example below does not fully help with your scenario and you have questions please post questions in the comment box at the bottom. I will try to help by providing further examples.

Stubbing SuperAgent allows the application unit tests to be dependancy free from external APIs and prevents any unexpected issues from appearing.

The testing libraries used are [mocha](https://mochajs.org/), [shouldjs](https://shouldjs.github.io/), [sinon](http://sinonjs.org/) and [should-sinon](https://github.com/shouldjs/sinon).

While this post is not about why I have chose these libraries I thought it would make a special mention for _shouldJS_ and _sinon-should_. I've chosen to use shouldJS because they help with the readability of your test code one. ShouldJS is similar to the [chaiJS](http://chaijs.com/) and either one is a great choice.

The _should-sinon_ helps make it easier to read asserts which check function calls are made and provide useful feedback if a test fails. For example:

{% highlight javascript %}
// without should-sinon: gives a failed message of
// expected false to be true (confusing)
stubbedMethod.calledOnce.should.be.true();

// with should-sinon it will give a message expecting 'stubbedMethod' to be called once
stubbedMethod.should.be.calledOnce();
{% endhighlight %}

## Stubbing SuperAgent with Sinon

Checkout the [example gist of stubbing SuperAgent](https://gist.github.com/rkotze/77aba69955dd6d97abf5) I've provided with comments. Below are more detailed explanations.

Importantly we setup a _stub_ in the `before` function allowing calls on the `put` function to be watched and return our own fake response.

{% highlight javascript %}
before(() => {
putRequest = sinon.stub(superagent, 'put');
});
{% endhighlight %}

When the store function is called to make a request to the api and it is possible to return a custom response. Below is an example when SuperAgent put request is called, it will return a new object with an `end` function which update the callback params.

{% highlight javascript %}
// At the start of the it function
putRequest.returns({
end: (cb) => {
cb(null, {ok: true, body: { "status" : "OK" }});
}
});
{% endhighlight %}

To capture the params of the end callback, _Sinon_ has a `getCall` function to return the params.

{% highlight javascript %}
let response = myStore.trigger.getCall(0).args[0];
{% endhighlight %}

To update the state using _Reflux_ the `trigger` callback should fire and using a spy the call can be captured.

{% highlight javascript %}
successTrigger.should.be.calledOnce();
{% endhighlight %}

The `putRequest` can be checked if it has been called with the correct url and the expected response is returned.

{% highlight javascript %}
putRequest.should.be.calledWith(URL);

response.status.should.eql('OK');
{% endhighlight %}

This is how I go about [stubbing SuperAgent using Sinon](https://gist.github.com/rkotze/77aba69955dd6d97abf5). If you have any feedback or questions please post in the comments below.

<script src="https://gist.github.com/rkotze/77aba69955dd6d97abf5.js"></script>
