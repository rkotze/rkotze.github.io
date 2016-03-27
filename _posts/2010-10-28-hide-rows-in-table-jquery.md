---
layout: post
title:  "Hiding rows in a table using JQuery without breaking table"
date:   2010-10-28 17:29:12 +0000
permalink: coding/hiding-rows-in-a-table-using-jquery
category: coding
---

I was writing a simple JQuery script which filters out table rows based on class name. &nbsp;When I used&nbsp;`visibility:hidden;` I noticed that when it was made visible again, the table looked slightly broken. To fix this instead of using `visibility:hidden` use `visibility:collapse;` and this keeps the table format correct when it is made visible again.

Below is the script that I wrote to filter the table and anyone is welcome to use it.

{% highlight javascript %}
$(document).ready(function () {

    $(".filter").click(function () {
         var rel = $(this).attr("rel");

          if (rel != "all") {
              $(".CompareTable tr").each(function (index) {
              if ($(this).attr("class") == rel) {
                  $("." + rel).css("visibility", "visible");
              }
              else if ($(this).attr("class") != "headRow" &amp;&amp; $(this).attr("class") != rel) {
                  $(this).css("visibility", "collapse");
                  $(".filter").removeClass("tabSelected");
              }
              });
          } else {
          $(".CompareTable tr").each(function (index) {
               $(this).css("visibility", "visible");
               $(".filter").removeClass("tabSelected");
          });
       }
       $(this).addClass("tabSelected");
       return false;
   });

});
{% endhighlight %}

Below is the CSS script used to collapse table rows without breaking it's format.

{% highlight css %}
visibility:collapse;
{% endhighlight %}
