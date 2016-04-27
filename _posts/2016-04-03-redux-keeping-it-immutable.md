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

Redux have reducers which is tasked with transforming the state across the application.
They are pure functions which is a function that does not modify variables outside of its scope
or depend on them. They are given the same parameters and the output should be the same every time.

Importantly they do not mutate the parameters or make any API calls.
This will prevent side effects from happening in your application.
They get the previous _state_ and _action_ which is transformed to return a new state.

Below are a few examples on preventing mutation:

Using `Array.prototype.concat` - returns a new array or you can use spread operator in a new array.

{% highlight javascript %}
const immutableArray = (oldState, newState) => {
	return oldState.concat([newState]);
}
{% endhighlight %}

{% highlight javascript %}
const immutableArray = (oldState, newState) => {
	return [...oldState, newState];
}
{% endhighlight %}

Don't directly change the `oldState` parameter object as this will mutate the object passed in and could affect the application in a later state. Instead use a new object `{}` or `Object.assign` to create a new object without affecting the old one.

{% highlight javascript %}
const immutableObject = (oldState, newState) => {
	return Object.assign({}, currentObject, { name: 'a', location: 'xyz'});
}
{% endhighlight %}