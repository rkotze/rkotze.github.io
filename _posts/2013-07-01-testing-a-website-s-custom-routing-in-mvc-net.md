---
layout: post
title:  Testing a website's custom routing in MVC .NET
date:   2013-07-01 17:00:12 +0000
permalink: /coding/testing-a-website-s-custom-routing-in-mvc-net
category: coding
meta_description: >
 Create a useful test helper to unit test routing in a mvc .net web app.
---

Building on what Phil Haack wrote a while ago to [test your mvc routing][1]. It is important to test your routing as it controls exactly where the users will go when they make a request. Especially if you have to maintain a complex CMS framework.

Haack used the&nbsp;[moq][2]&nbsp;framework to write a test helper method, I have modified his&nbsp;code to use&nbsp;[NSubstitue][3], a different mocking framework:

{% highlight csharp %}
public static class RouteTestHelper
{
    public static void AssertRoute(RouteCollection routes, string url, object expectations)
    {
        var httpContextMock = Substitute.For<httpcontextbase>();
        httpContextMock.Request.AppRelativeCurrentExecutionFilePath.Returns(url);

        RouteData routeData = routes.GetRouteData(httpContextMock);
        Assert.IsNotNull(routeData, "Should have found the route");

        foreach (var kvp in new RouteValueDictionary(expectations))
        {
            Assert.IsTrue(string.Equals(kvp.Value.ToString(), routeData.Values[kvp.Key].ToString(), StringComparison.OrdinalIgnoreCase)
                , string.Format("Expected '{0}', not '{1}' for '{2}'.", kvp.Value, routeData.Values[kvp.Key], kvp.Key));
        }
    }
}
{% endhighlight %}

This will build the routes table in your MVC application and we mock the request via HttpContextBase. The `expectations` should contain the key/value pairs you expect to be in the `routeData.Values`.

Below is an **example unit test**.

{% highlight javascript %}
[TestMethod]
public void CategoryRoute()
{
       var routes = new RouteCollection();
       CnMvcApplication.RegisterRoutes(routes);

       RouteTestHelper.AssertRoute(routes, "~/news", new { controller = "category", action = "index"});
}
{% endhighlight %}

Hopefully this is easy to understand and helps you setup your unit tests quickly.

[1]: http://bit.ly/17HLpzZ
[2]: https://code.google.com/p/moq/
[3]: http://nsubstitute.github.io/