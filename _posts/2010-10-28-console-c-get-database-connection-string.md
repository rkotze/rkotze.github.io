---
layout: post
title:  Console C# get database connection string from app.config
date:   2010-11-28 17:00:12 +0000
permalink: top-tips/console-c-get-database-connection-string-from-app-config
category: top-tips
meta_description: >
 How to get the connection string from the app.config file in a C# console application
---

When writing a console application using C# / .NET and you want to connect to a database, the connection string is typically stored in the app.config file. 

Below is an example of a web.config which is the same an app.config file used in C#.Net. It is essentially an XML file that stores required data to make your application work. It keeps these bits of data in one place, making it easy to manage when things change. There will be no need to hunt down connection strings or other configuration data with in your application code. To extend further on this top tip I have written a [tutorial on how to use CSharp with MySQL][1].

{% highlight xml %}
<configuration>
  <connectionstring>
    <add key="MySQL.DB" value="server=localhost;database=mysqldbname;user=username;password=12345678;">
  </add></connectionstring>

  <system.web>
    <compilation debug="true" defaultlanguage="c#"></compilation>
  </system.web>

</configuration>
{% endhighlight %}

To access the connection string the first step would be to make sure that a **reference is added** to _System.Configuration._ Then make sure you include it in the class _using System.Configuration_ and the code below is used to access the connection string.To access the connection string the first step would be to make sure that a **reference is added** to _System.Configuration._ Then make sure you include it in the class _using System.Configuration_ and the code below is used to access the connection string.

{% highlight c# %}
using System.Configuration;

string MysqlConnectionString = ConfigurationManager.ConnectionStrings["dbconnectionstring"].ConnectionString;
{% endhighlight %}

This method can also be used to access the _app.config_ file for any web applications. If you find you can't access the _ConfigurationManager_ class, it might be that you don't have a reference to it and you will need to added it in.

[1]: /coding/use-mysql-with-c-sharp-net