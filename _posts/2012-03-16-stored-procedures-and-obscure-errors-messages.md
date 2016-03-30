---
layout: post
title:  Stored procedures and obscure errors messages
date:   2012-03-16 17:00:12 +0000
permalink: stored-procedures-and-obscure-errors-messages/
category: coding
meta_description: >
 Fixing a strange error when using stored procedures. Unable to cast object of type 'System.DBNull' to type 'System.String'
---

Recently found a extremely simple way to fix a problem in one of our projects at work in MySQL stored procedures. Hopefully saving everyone else the massive amount of time spent adapting the program to work.

What was the problem and how did this error occur. In our&nbsp;C-sharp dot NET&nbsp;project we needed to upgrade the MySQL .Net connector dll from 6.3.x to 6.4.x.

The project built fine but when running the INSERT function it through this nice unrelated error message - "Unable to cast object of type 'System.DBNull' to type 'System.String'". So from working fine in the previous version to failing in the next with this strange error message. We soon discovered that is was some sort of permissions error. Simply assigning the user&nbsp;all permissions&nbsp;fixed it but the problem with that was this user can not have all permissions! Not the solutions we are looking for.

Anyway we did not find any real solutions or cases from searching the web, so we moved from stored procedures to using the standard insert command. Took a while to change but eventually got working.

We then came across another issue which lead to us altering the connection string in our web.config file. A the end we put&nbsp;_check parameter = false_by default this is set to true. The changed fixed this small issue but we decided to test it with our original program using stored procedures. This essentially allowed our stored procedures to work. Not exactly sure how it fixed our first issue but it does. According to MySQL it: "[Indicates if stored routine parameters should be checked against the server][1]". This might be allowing the user permissions authenticate against MySQL server rather than in the MySQL .NET Connector or something along them lines.

### Conclusion

Use&nbsp;check parameter = false&nbsp;in your MySQL connection string when using stored procedures!

Simples.

[1]: http://dev.mysql.com/doc/refman/5.1/en/connector-net-connection-options.html
  