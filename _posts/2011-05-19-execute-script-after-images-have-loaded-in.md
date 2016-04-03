---
layout: post
title:  Execute JavaScript after images have loaded in
date:   2011-05-19 17:00:12 +0000
permalink: /coding/execute-script-after-images-have-loaded-in
category: coding
meta_description: >
 Need to execute a script after images have loaded in? A simple jquery method can solve that.
---

I found myself needing to run a script to make minor adjustments to the page based on the size of an image, to keep things tidy. The problem I was having was using JQuery's _$(document).ready_ the script was executing as soon as the DOM was ready which is too early.&nbsp;The other option is to use _$(window).load_ which runs only when the whole page has loaded, guaranteeing that I will get the image width and I can make my adjustments. The script below is used to make the image caption the same width as the image.

{% highlight javascript %}
$(window).load(function () {
  imgWidth = $("#mainImg").attr("width");
  var caption = $(".imgCaption");
  if (imgWidth &lt; 300) {
      captionWidth = imgWidth - (parseInt(caption.css("padding-left")) + parseInt(caption.css("padding-right")));
      caption.css("width", captionWidth+"px");
  }
});
{% endhighlight %}
