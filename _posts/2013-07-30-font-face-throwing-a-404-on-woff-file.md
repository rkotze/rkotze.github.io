---
layout: post
title:  "@font-face throwing a 404 on woff file"
date:   2013-07-30 17:00:12 +0000
permalink: /fixes/font-face-throwing-a-404-on-woff-file
category: fixes
meta_description: >
 .woff throwing a 404 in Google Chrome and Firefox when serving fonts from IIS.
---

I've noticed that in _Google Chrome_ and _FireFox_ console the font file resources .woff throws a 404 when using `@font-face` CSS feature.

You will need to add a configuration&nbsp;to allow _IIS_ to serve the font. In your web.config you&nbsp;can add the follow lines in the `system.webServer` block:

{% highlight xml %}
<system.webserver>
     <staticcontent>
            <mimemap fileextension=".woff" mimetype="application/x-font-woff">
     </mimemap></staticcontent>
</system.webserver>
{% endhighlight %}

By applying this mimeType: `application/x-font-woff` for .woff will should fix this issue in Chrome and Firefox. This is the mimeType they request and IIS can't work out which file type is should serve until it registered in the web.config or IIS.
