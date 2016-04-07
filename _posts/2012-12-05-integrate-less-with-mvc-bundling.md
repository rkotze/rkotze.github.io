---
layout: post
title:  Integrate LESS with MVC bundling
date:   2012-12-05 17:00:12 +0000
permalink: /top-tips/integrate-less-with-mvc-bundling
category: top-tips
meta_description: >
 Example on how to add less into the bundling process of your .net mvc web app.
---

_Less_ is an excellent tool for any developer to help mange _CSS_ code. [SASS ][1]is also a great tool that does a similar job but this post is &nbsp;focused on [_LESS_][2] and bundling it with your _ASP.NET MVC_ web application.

.NET MVC provides a very useful optimisation tool for web sites called bundling. I [explain bundling in MVC][3] in a previous post, if you are not familiar with it.

It is possible to neatly integrate LESS with the bundling process, which I will explain and provide examples how to implement.

Firstly you will need to reference the [dotless dll][4] into your project, which can be added via Nuget. Create a new class file which I have called LessTransform. This inherits off of IBundleTransform, the interface used to transform _CSS or JavaScript_ files into one file1. Add a method called Process, which will be used to convert the _LESS_ files into _CSS_.

{% highlight csharp %}
using System.Web.Optimization;
...
public class LessTransform : IBundleTransform
{
    public void Process(BundleContext context, BundleResponse response)
    {
        response.Content = dotless.Core.Less.Parse(response.Content);
        response.ContentType = "text/css";
    }
}
{% endhighlight %}

In the global.asax file add RegisterBundles method with the following code to run the _LESS transform_ and bundle into _CSS_. The [bundle process is better explained][5] in my previous post if you are uncertain on how to implement it.

{% highlight csharp %}
//Global asax
public void RegisterBundles(BundleCollection bundles)
{
     var lessBundle = new Bundle("~/Content/BundledLess").Include("~/Content/myDemo.less");
     lessBundle.Transforms.Add(new LessTransform());
     lessBundle.Transforms.Add(new CssMinify());
     bundles.Add(lessBundle);
}
{% endhighlight %}

In between the header reference the bundled LESS into your web application as shown below.

{% highlight csharp %}
...
@Styles.Render("~/Content/BundledLess")
...
{% endhighlight %}
    

Something I really like about this set-up is you don't need to rebuild your app every time you make a change to your LESS file. The changes are automatically updated when your refresh your browser. There is no need to run a tool in the background to watch and convert the file into CSS every time it is saved.

**Update:&nbsp;**After playing around further with intergrating LESS&nbsp;with bundling I have discovered the the paser method fails to&nbsp;_import_ files when using&nbsp;**@import**. It fails because the file path it tries to find are&nbsp;incorrect and so can't resolve the file location to import the file. However I have found a bug fix which you just need to copy in with what is created above. View this [code that fixes the issue][6] and add to your project.

* * *

_1\. Found useful code on The Official Microsoft ASP.NET Site - [Bundling and Minification][7]._

[1]: http://sass-lang.com/
[2]: http://lesscss.org/
[3]: /top-tips/mvc-4-bundling-css-and-js-files
[4]: http://nuget.org/packages/dotless
[5]: http://www.richardkotze.com/web-development/mvc-4-bundling-css-and-js-files/
[6]: https://gist.github.com/2002958
[7]: http://www.asp.net/mvc/tutorials/mvc-4/bundling-and-minification
  