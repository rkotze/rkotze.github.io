---
layout: post
title:  "JavaScript singleton pattern"
date:   2016-09-11 17:00:12 +0000
permalink: /coding/javascript-singleton
category: coding
published: false
meta_description: >
 What and how to implement the singleton in JavaScript
excerpt_separator: <!--more-->
---

The Singleton pattern is to ensure there is only one instance of the class exists. When there is an instance it returns that reference to that object. This is normally achieved by a method belonging to the class to create a new instance of the class if one does not exist.

<!--more-->

Basic and typical implementation of a singleton in JavaScript using an object literal:

{% highlight javascript %}
const aSingleton = {
	propA: 'some value',

	propB: 3,

	someMethod: () => {
		return 'some text';
	}

};
{% endhighlight %}


Provide some encapsulation:

{% highlight javascript %}

{% endhighlight %}


Save on memory resource and use it when the object is needed:

{% highlight javascript %}

{% endhighlight %}