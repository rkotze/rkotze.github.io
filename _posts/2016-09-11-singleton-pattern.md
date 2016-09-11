---
layout: post
title:  "JavaScript singleton pattern"
date:   2016-09-11 13:00:12 +0000
permalink: /patterns/javascript-singleton-pattern
category: patterns
meta_description: >
 What and how to implement the singleton in JavaScript
excerpt_separator: <!--more-->
---

The Singleton pattern is to ensure there is only one instance of the class exists. In the case it does exist it returns a reference to that object. This is normally achieved by a method belonging to the class to create an instance of the class.

<!--more-->

Singleton in JavaScript is useful to for providing a single point of access to functions which are isolated from the global namespace.

Example are written in ES2015 syntax.

Basic and typical implementation of a Singleton in JavaScript using an object literal:

{% highlight javascript %}
const aSingleton = {
	propA: 'some value',

	propB: 3,

	someMethod() {
		return 'some text';
	}

};
{% endhighlight %}


Maybe you want to have private fields and functions? These can be encapsulated inside of a closure and returning an object literal to expose selected items.

{% highlight javascript %}
const aSingleton = () => {
	const privateField = 'abc';

	function privateFunction(){
		return 'some private data ' + privateField;
	};

	return {
		publicMethod() {
			return privateFunction();
		}
	};
};
{% endhighlight %}

Another technique is to instantiate the class when it's needed which can help save on resource:

{% highlight javascript %}

const ASingleton = (() => {
	let isInstance;

	function initSingleton() {
		return {
			aProp: 'with value',
			publicMethod() {
				return 'something valuable';
			}
		};
	}

	return {
		getInstance() {
			if(!isInstance){
				isInstance = initSingleton();
			}
			return isInstance;
		}
	};
}());

ASingleton.getInstance().publicMethod();

{% endhighlight %}
