---
layout: post
title:  Insert else update
date:   2011-02-20 17:00:12 +0000
permalink: /coding/insert-else-update
category: coding
meta_description: >
 Useful MySql insert update query, which updates when entry exists or inserts if not.
---

Here is something that I recently found very useful. If you have a table in your MySQL database which you want to insert a record if it does not exist but update the row if it does. MySQL 5.x has a very neat piece of script to handle this with out any conditional statements.

{% highlight sql %}
INSERT INTO table (id_col, b_col, c_col)
VALUES (2938, 2, 3)
ON DUPLICATE KEY UPDATE c_col="update col";
{% endhighlight %}

By using the _ON DUPLICATE KEY_ after the insert statement you don't need to specify which row needs updating, only the columns because it works it out on the unique key column. The unique key column is essential to make the update work else it will just insert all the time. See [MySQL development area][1] to read more about it

_It is important to note:_ that you need MySQL 5 or greater for this script to work. Otherwise you will have to use the old school method.

{% highlight php %}
$result = mysql_query("update table set c_col='testing' where id_col='1';");
if (mysql_affected_rows()==0) {
	$result = mysql_query("insert into table (id_col, c_col) values ('1','testing');");
}
{% endhighlight %}

First test the update statement then if that returns zero affected rows then you run the insert statement. Simples. But of course this is much more code and less efficient. Upgrade if you can!!

[1]: http://dev.mysql.com/doc/refman/5.0/en/insert-on-duplicate.html
