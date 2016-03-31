---
layout: post
title:  Regex link removal script
date:   2012-02-16 17:00:12 +0000
permalink: /coding/regex-link-removal-script
category: coding
meta_description: >
 Tips and basic regex script to remove links from content.
---

Need to remove links from your content? This regex patten should do the trick.

First you will need to choose a programming language has regex functionality and returns the properties start position, the length and group values of a string.

Then use a substring method to extract the string that matched the pattern.

Use the replace function to remove the link and use group two from the results of the regex function to put back the link text.

{% highlight regex %}
(<a\s*href="http://www\.sitename\.com/[a-zA-Z0-9-\?&;%=/_""\s\.]*">)([a-zA-Z0-9-\?&;%=/_"\s\.]*)(</a>)
{% endhighlight %}

Example below is using c#.

{% highlight csharp %}
if (myMatchs.IsMatch(newContent))
{
  Status = "[Match]";

  try
  {
        int totalMatches = myMatchs.Matches(newContent).Count;
        Match keyMatch;
        string m;

        for (int i = 0; i &lt; totalMatches; i++)
        {
               keyMatch = myMatchs.Match(newContent);
               m = newContent.Substring(keyMatch.Index, keyMatch.Length);
               changes += " , " + m;
               newContent = newContent.Replace(m, keyMatch.Groups[2].Value);
         }
    }
    catch (Exception ex)
    {
          Status = string.Format("[Fail] - {0}", ex.Message);
    }
}
else
{
  Status = "[No Match]";
}
{% endhighlight %}

A good idea would be to output the changes to a text file so you can track the modifications.

If you are replacing links in MySql database, using innodb engine use transactions so you can check the changes before committing them.
