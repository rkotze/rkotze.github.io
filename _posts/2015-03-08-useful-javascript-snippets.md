---
layout: post
title:  Useful JavaScript snippets
date:   2015-03-08 17:00:12 +0000
permalink: /top-tips/useful-javascript-snippets
category: top-tips
meta_description: >
 How to use the call and apply, more precise typeof operator and extending functionality to JavaScript's global objects.
---

I have picked a few useful features of JavaScript which you might find helpful and I will explain how to use them.

## Using call and apply

The `call` and `apply` methods are other&nbsp;ways of calling a function. They are both similar but there is a minor difference between them, the call function takes a list of arguments and apply takes a single array to pass as arguments.

The first parameter can be different this object. For instance a function which&nbsp;belongs&nbsp;to objectA but you want to use its&nbsp;functionality in objectB. Instead of duplicating the functionality you can use the call method and pass in objectB for it to get that functionality.

{% highlight javascript %}
myFunc.call(null, arg1, arg2, arg3);

myFunc.apply(null, ['a','b','c']);
{% endhighlight %}

With apply you can pass arguments from one function to another or generate an array of values to pass. These features are great tools to help us reuse functionality.

{% highlight javascript %}
function foo() {
    bar.apply(null, arguments);
}
function bar(a, b, c) {
    // do awesome stuff
}
{% endhighlight %}

## Arguments and converting to an array

The `arguments` object is&nbsp;array-like and stores a collection of passed parameters in the&nbsp;function. You can loop through it as normal&nbsp;to access the values and you can modify them.

{% highlight javascript %}
var myFunc = function(){
  arguments[1] = 'bye';
  return arguments;
};
myFunc('hello', 'world');
//output -&gt; [object Arguments] {
//  0: "hello",
//  1: "bye"
//}
{% endhighlight %}

This is not a good idea to do but it's just to demonstrate the point. The only other available property is `length` otherwise there is no other properties or methods like `join()` or `push()`&nbsp;on the arguments object. If you want to have access to normal array features then you can convert it to an array like so.

{% highlight javascript %}
var args = Array.prototype.slice.call(arguments);
{% endhighlight %}

This is one way but `slice` on arguments prevents optimisations in JavaScript engines so would be best to try building a new array by iterating through the arguments.

## Find the object type

The simple way of working out what&nbsp;type you are dealing with you can use `typeof` but you might get results you don't expect. Follow [this link][1] to read more about the `typeof` operator and the values it returns.

Using some of&nbsp;what we have learned so far we can figure out better results. We can create our own `typeOf` function by using the call method on the object toString method. This string contains the actual type of the object and we extract that out using a regular expression. Which is then converted to lowercase.

{% highlight javascript %}
var typeOf = function(obj) {
 var type = ({}).toString.call(obj).match(/s([a-zA-Z]+)/)[1].toLowerCase();
};
{% endhighlight %}

You can now pass an array in this function and instead of getting object as the value you will get array. Same with null. This is very useful if you need to know the actual type.

## Extending functionality to built in objects

If you come from a c# background you might like to have the `string.format` function. So how can you have a format method available for all strings? Simple you can add a format function to the `String.prototype`. This principle can be applied to the other global objects like Array, Function,&nbsp;Object and the others.

{% highlight javascript %}
String.prototype.format = function() {
   var args = arguments;
   return this.replace(/{(d+)}/g, function(match, number) {
     return typeof args[number] !== 'undefined' ? args[number] : match;
   });
};

//usage
var urlQuery = "?page_number={0}&amp;page_size={1}".format(1, 20);
//output -&gt; "?page_number=1&amp;page_size=20"
{% endhighlight %}

Hope you will have a use for these snippets of code in your next app. Happy hacking.

[1]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof
