---
layout: post
title:  Redux keeping it immutable
date:   2016-04-03 17:00:12 +0000
permalink: /coding/redux-keeping-it-immutable
category: coding
published: false
meta_description: >
 Redux uses pure functions and encourages that the state is not mutated.
---
{% highlight javascript %}
{% endhighlight %}

Couple of things to do and not to do.

{% highlight javascript %}
Array.prototype.immutablePush = (value) => {
	return this.concat([value]);
}
{% endhighlight %}

{% highlight javascript %}
Array.prototype.immutablePush = (value) => {
	return [...this, value];
}
{% endhighlight %}

array.push - use a new array with spread operator or concat
array.splice - use slice with spread operator or concat
array remove - use concat and slice

map function returns a new array

Don't directly change the object, use a new object or object.assigns or spread