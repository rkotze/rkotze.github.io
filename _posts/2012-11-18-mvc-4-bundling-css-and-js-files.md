---
layout: post
title:  MVC 4 bundling CSS and JS files
date:   2012-12-05 17:00:12 +0000
permalink: /top-tips/mvc-4-bundling-css-and-js-files
category: top-tips
meta_description: >
 MVC 4 how to bundle your css and javascript files to improve performance.
---

MVC 4 provides an excellent tool to help with optimising your web application called _bundling_. The idea of bundling is quite simple, you tend to have multiple _CSS_ and _JavaScript_ files which can be rolled up into one CSS and JS file. The contents of the files is also _minified_ to reduce the individual file size. It might seem odd at first to _bundle all your files_ into one but the idea is to reduce the number of _http_ calls made, because a web browser can only handle two - four http requests at a time. If you have a lot of request to different files this can make your web app appear slow.

Another benefit of MVC bundling package is when you release an update to a CSS file the client will get the latest changes rather than the cached version. Because the file has an appended query string with a hashed version which is automatically updated with the file is changed. You don't even need to rebuild or build the web project after its running.

## Bundling in MVC 4

This is pretty easy to set up. If you start a new project then this is already preconfigured and is set up using the default CSS and JS files. If you want to add in your own files or alter the file structure you will need to change your code slightly in the _global.asax.cs_ file. If you change the file structure the method _RegisterTemplateBundles_ will return nothing or not include your new files. This is because the files are registered, meaning it looks for those specific files. What you need to do is change this to _EnableDefaultBundles_ in the global.asax.cs file, inside the _Application_Start_ method. **See example below:** Change from this:

{% highlight csharp %}
protected void Application_Start()
{
  ...
  BundleTable.Bundles.RegisterTemplateBundles();
  ...
}
{% endhighlight %}

To this:

{% highlight csharp %}
protected void Application_Start()
{
  ...
  BundleTable.Bundles.EnableDefaultBundles();
  ...
}
{% endhighlight %}

If you have upgraded your project from MVC 3 to MVC 4 then all you need to do is add the following lines of code to your __layout.cshtml file_ in between the head element.

{% highlight html %}
<head>
    <link href="@System.Web.Optimization.BundleTable.Bundles.ResolveBundleUrl("~/Content/css")" rel="stylesheet" type="text/css" />
    <script src="@System.Web.Optimization.BundleTable.Bundles.ResolveBundleUrl("~/Scripts/js")"></script>
</head>
{% endhighlight %}

## Can I bundle using MVC 3?

You can indeed. It is of course slightly more involved. In your project go to Nuget project manager and search for _microsoft.web.optimization_ and make sure you include pre-releases in the drop down. You will need to install the latest beta version. Once that is installed add the using to the _global.asax.cs_ file and add the following method as well.

{% highlight csharp %}
using System.Web.Optimization;
{% endhighlight %}

{% highlight csharp %}
public void RegisterBundles(BundleCollection bundles)
{
  bundles.Add(new ScriptBundle("~/Scripts/BundledScripts").Include(
      "~/Scripts/jquery.*",
      "~/Scripts/jquery-ui-1.8.20.js")
  );

  bundles.Add(new StyleBundle("~/Content/BundledCSS").Include(
       "~/Content/Site.css",
       "~/Content/themes/base/jquery-ui.css")
  );
}
{% endhighlight %}


The first part _ScriptBundle_ points to a directory that does not exist in your file system, a temporary name. This is what you reference in your __layout.cshtml_ file when loading in your JavaScript. If the directory name exists you application then the minify and bundling will fail. The _Include_ is a list of files you would like to _bundle_. Then call this new method in the _Application_Start_.

{% highlight csharp %}
protected void Application_Start()
{
  ...
  RegisterBundles(BundleTable.Bundles);
  ...
}
{% endhighlight %}

An important thing to note is in **debug mode** the scripts and css files are referenced normally, not bundled and minified. When you create your _deployment package_ or _release package_ the files are _bundled_ together. But you can check if they are bundling the way you expect by adding in this line in your new _RegisterBundle_ function.

{% highlight csharp %}
BundleTable.EnableOptimizations = true;
{% endhighlight %}

Now you can check nothing strange happens when putting the files together. Obviously it is important that certain scripts are loaded in the correct order as they might have dependencies on each other.

## How to reference your new bundle in the _layout.

By using the following lines for outputting the markup for referencing style and script files between the head tag.

{% highlight csharp %}
@Styles.Render("~/Content/BundledCSS")
@Scripts.Render("~/Scripts/BundledScripts")
{% endhighlight %}

There you have it, how to bundle your _styles and scripts_ in both MVC 4 and 3 to help improve the performance of your web sites.