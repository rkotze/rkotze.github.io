---
layout: post
title:  A faster web Delay JavaScript loading to last
date:   2013-09-28 17:00:12 +0000
permalink: /coding/a-faster-web-delay-javascript-loading-to-last
category: coding
meta_description: >
 Delay the loading of JavaScript to improve the performance of your website by getting the first render to show soon as possible
---

The speed of a website is important to most users especially when they are looking for specific information. They won't wait around long for your website to load for that information and will try find it somewhere else. One way to motivate the user to stay is to get some content showing that they can consume&nbsp;as soon as possible to give incentive&nbsp;that the rest will be arriving shortly. The common blockers that cause the long wait from a blank page to all of a sudden everything shows&nbsp;are CSS and JavaScript files.

I will focus on JavaScript part as it's the topic of this post&nbsp;and commonly misplaced on the website.&nbsp;

The first and hopefully obvious thing is&nbsp;**not** to put the JavaScript file in the head of the HTML file. There are some rare&nbsp;cases where you have to put it there but in most you don't. There is always a way to make it work when the document is ready.

It's a good idea to group the references to&nbsp;your JavaScript files together because they will load&nbsp;concurrently. If it is mixed up between CSS files&nbsp;the JavaScript above the CSS will load in completely before moving on the CSS reference below it. You can test this out but checking a waterfall diagram when doing website performance tests. Go to [WebPageTest.org][1] to try it out.

What I think makes the most difference is taking all your JavaScript files and load it after the `window.onload` event is fired. If you think about what JavaScript does you will find it is mostly event base on user interactions. These interactions tend to happen later on and make sense to load&nbsp;in later. For instance social media buttons e.g. Facebook Like, Twitter and Google+ buttons are surprisingly&nbsp;resource&nbsp;heavy combined and users probably will only interact with them after reading an article.

Here is some example code of listening for the `onload` event and calls a function to load in all your JavaScript files.

{% highlight javascript %}
if (window.addEventListener)
  window.addEventListener("load", downloadJSOnload, false);
else if (window.attachEvent)
  window.attachEvent("onload", downloadJSOnload);
else window.onload = downloadJSOnload;
{% endhighlight %}

Then I take it further by using a small JavaScript library to load in these files mainly because it's proven to work code so you don't encounter&nbsp;any bugs that someone has already solved. Hopefully.&nbsp;It is also possible to load in less important CSS files. Link to [Lazyload.js][2] library.&nbsp;Below is my sample code.

{% highlight javascript %}
function downloadJSOnload() {
 var lazyEl = document.createElement("script");
 var addLazy = document.getElementsByTagName("script")[0];
 var done = false;

 lazyEl.onload = lazyEl.onreadystatechange = function () {
  if (!done &amp;&amp; (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
   done = true;
   LazyLoad.css(["/CSS/includes?v=kyY4ouTB6YVkFJ7AARUYkwVsJhpFEqg8dIaXgtM3uGA1"],
    function () {
     console.log("Loaded in CSS includes.");
    });

   LazyLoad.js([
     "/Scripts/CapabilityTest?v=GtzMeSZvVIUA6ad_PniagJLszgSDclf8WX3rlUbGQSU1",
     "//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js",
     "/Scripts/BundledMinifiedScripts?v=clN_5zxhG0h-6jaNDlJCtclm8Lkcy5zp_JkOEdEnARQ1"
     ], function () {
      console.log("All scripts loaded!");
     });
   // Handle memory leak in IE
   lazyEl.onload = lazyEl.onreadystatechange = null;
  }

 };
 lazyEl.src = "/Content/javascripts/vendor/lazyload-min.js";
 addLazy[removed].insertBefore(lazyEl, addLazy);
}
{% endhighlight %}

I inject the lazyload.js file and wait for it to load in. When this has&nbsp;I then load the rest of the files using this library.

**Important** to remember that this script is inline near to&nbsp;the closing body tag and not in its own file. You don't want to reference a file as it would defeat the point of loading&nbsp;non-blocking JavaScript.

You will notice that the files have a hash value at the end, this is essentially cache busting when these files have been updated all users will the latest version without them having to empty their browser cache.

This post gives a few useful tips to make the loading of your website faster by better organising the way JavaScript is loaded in. Depending on the size of your JavaScript resources this could save you 1 - 3 seconds for the first render which will encourage a significant&nbsp;portion of your audience to wait a little longer for your web page to completely load in.

[1]: http://www.webpagetest.org/
[2]: https://github.com/rgrove/lazyload/