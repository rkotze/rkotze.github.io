---
layout: post
title:  Mobile website or responsive design
date:   2013-02-18 17:00:12 +0000
permalink: /mobile-website-or-responsive-design
category: top-tips
meta_description: >
 Discussion on benefits and negatives for choosing to create a mobile website or a responsive website.
---

How do you go about choosing whether&nbsp;to develop a&nbsp;mobile site or responsive website? I would say its depends on what you are trying to achieve and with all the&nbsp;hype over responsive design you might sway in favour of that. In this post I&nbsp;discuss some benefits&nbsp;and negatives&nbsp;about both options&nbsp;which hopefully will help you come to a better decision.

Please feel free to add your own views about this in the comments below.

## Dedicated mobile website

_Benefits_:

Focused on delivering on a&nbsp;mobile site has greater performance over a mobile network than&nbsp;responsive design would have. Essentially in responsive design you are only altering the layout of the website based on the screen size. This means you are loading in all the content for a desktop site when the user is using a mobile device. The are ways to combat what is loaded in like using media queries to load in specific CSS&nbsp;for a device. What about images, video, JavaScript and other content, currently quite difficult to make work. Even if there was support for each of these things, you would also have to find a way to manage the complexity of all your additional code.

A mobile website is a simple design and keeping all the relevant code contained within one place. Making both websites separate clearly defines what belongs where and reduces the&nbsp;complexity.

_Negatives_:

If you want to cover multiple devices like mobile,&nbsp;7",&nbsp;10" tablets&nbsp;and desktop you will need a website for each. As a web developer you might have to run an update that applies to all websites, which could take a long time to roll out. Then you might have to times that by the number of websites owned. Having so many individual website will consume a lot of resources,&nbsp;meaning you might have to spread the&nbsp;websites across multiple&nbsp;servers. Managing deployment of the websites could be complex and certainly time consuming.

Naturally each&nbsp;website will have its own unique features so there will be a lot more for the&nbsp;web developer to look after and maintain.

Make sure a [canonical&nbsp;url][1] is defined on your mobile website that points to the desktop version. For example you might have m.mywebsite.com and mywebsite.com. In most cases&nbsp;you want all traffic to go to the desktop site and then it decides if the mobile site should be displayed.&nbsp;I've seen the issue where search engines choose the mobile site over the desktop in search results. This is because they try to pick which is the best one but may not choose the one you expect. Define one in the head of your web page to prevent this issue.

## Responsive design

_Benefits_:

Probably the greatest benefit for responsive design approach is it&nbsp;can adapt to multiple screen sizes preventing the need to develop a&nbsp;number of mobile websites. You can view the changes in your desktop browser&nbsp;on the fly by simply resizing the window. Multiple screen sizes can be defined for each device you want to adapt for rather than using server side programming to&nbsp;inspect&nbsp;the device and determine if it should redirect to the mobile version or not. This means you cover a large variety of&nbsp;different&nbsp;devices&nbsp;with very little complex programming.

Not sure this is completely a benefit but all code is&nbsp;contained within one web application making the&nbsp;deployment time&nbsp;less. The website maintenance of code is less but perhaps more complex.

_Negatives_:

Just to reiterate a previous point made it will be difficult to keep the page size low when&nbsp;handling&nbsp;a request from a&nbsp;mobile device.&nbsp;

Responsive design does seem simple on the surface but if you going to implement it properly it can be complex to create and manage effectively. Realistically speaking you will need a [responsive strategy][2] to help implement this effectively for multiple devices. It will probably be helpful to use some sort of CSS framework&nbsp;that has responsive features.

This may or may not be much of an issue but you can't view the desktop site when using a mobile device. This does depend on the complexity of your website, typically you don't show everything that is on the desktop site on the mobile version because that is near impossible. Nonetheless a&nbsp;user might be looking for this feature on their mobile for whatever reason&nbsp;but have not way to access it.

### Conclusion

Both options are trying to provide a means to improve the users experience for&nbsp;accessing content on mobile devices.

I think if you are trying to maximise the coverage for maximum&nbsp;number of devices then you will benefit the most from the responsive design approach. But if you are more concerned with delivering a good mobile experience (excludes tablet devices) then a dedicated mobile website is the better option.

Something to think about but are we far from the future where&nbsp;making a mobile or responsive site will be of low value? As mobile connections become faster, be processing and have high resolutions maybe&nbsp;accessing content won't be much of an issue.

[1]: http://www.mattcutts.com/blog/seo-advice-url-canonicalization/
[2]: http://www.uie.com/articles/strategy_for_responsive_design
  