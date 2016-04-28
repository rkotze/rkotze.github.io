---
layout: post
title:  Redux, keeping it immutable
date:   2016-04-28 17:00:12 +0000
permalink: /coding/redux-keeping-it-immutable
category: coding
meta_description: >
 Redux uses pure functions and encourages that no mutation takes place.
---

Redux has reducers tasked with transforming the state across the application.
They are pure functions, which is a function that does not modify variables outside of its scope
or depend on them. They are given the same parameters and the output should be the same every time.

Importantly they do not mutate the parameters or make any API calls.
This will prevent side effects from happening in your application.
They get the previous _state_ and _action_ which is transformed to return a new state.

Below are a few examples on preventing mutation:

Using `Array.prototype.concat` - returns a new array or you can use ES6 spread operator `...` in a new array.

{% highlight javascript %}
const immutableArrayPush = (oldState, newValue) => {
	return oldState.concat([newValue]);
};

//usage
immutableArrayPush([1,2,3], 4); //=> [1,2,3,4]
{% endhighlight %}

Below is an example of using the ES6 spread operator instead.

{% highlight javascript %}
const immutableArrayPush = (oldState, newValue) => {
	return [...oldState, newValue];
};

//usage
immutableArrayPush([1,2,3], 4); //=> [1,2,3,4]
{% endhighlight %}

Don't directly change the `oldState` parameter object, use a new object `{}` or `Object.assign` in the return.
Below the `currentObject` and `newState` are merged if they have similar properties the right most parameter
will have priority. It then returns a new object.

{% highlight javascript %}
const immutableObjectUpdate = (oldState, newState) => {
	return Object.assign({}, currentObject, { name: 'a', location: 'xyz'});
};

//usage
immutableObjectUpdate(
	{ a: 'value a', b: 'value b'}, 
	{ a: 'new value', location: 'xyz'}
	); //=> { a: 'new value', b: 'value b', location: 'xyz' }
{% endhighlight %}

Below is a way to remove an item from an array without mutating it.

{% highlight javascript %}
const immutableArrayRemove = (currentList, removeFrom) => {
	return currentList
					.slice(0, removeFrom)
					.concat(currentList.slice(removeFrom + 1));
};

//usage
immutableArrayRemove([0,90,150], 1); //=> [0,150]
{% endhighlight %}

ES6 spread operator example below:

{% highlight javascript %}
const immutableArrayRemove = (currentList, removeFrom) => {
	return [
		...currentList.slice(0, removeFrom),
		...currentList.slice(removeFrom + 1)
	];
};

//usage
immutableArrayRemove([0,90,150], 1); //=> [0,150]
{% endhighlight %}