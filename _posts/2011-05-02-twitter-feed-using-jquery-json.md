---
layout: post
title:  Twitter Feed using JQuery JSON
date:   2011-05-02 17:00:12 +0000
permalink: /twitter-feed-using-jquery-json
category: coding
meta_description: >
 Use JQuery getJson method to help return twitter api data in a JSON format.
---

The Twitter API allows you to access tweets, profile information and more. It has a couple of return types of data, I will be using the JSON format. If you are accessing the tweets that belong to a profile you don't need authentication unless they are protected. In the documentation it will tell you if authentication is required to access certain data.

I will show you how to create your own Twitter Feed using the [Twitter API][2] and [JQuery _$.getJson()_][3] method. I have also added in some other functions to, for the date to convert it to "real time". Instead of giving a time stamp it now can say, "a minute ago" or "1 hour ago" or " 1 day ago" and so forth. Find text links and actually turn them into&nbsp;click-able links which open in a new window.&nbsp;The _$.getJson() _method first parameter takes the resource URL and the second parameter is a callback function with the data object, which I have called _tweetdata. _The first call is to collect data about the user profile. In the query string you see the parameter _screen_name _this is where you enter your user name and the _callback_ parameter is required so that we can use the callback function.

Since the data is returned in a JSON object you essentially have a range of properties. The properties that I choose to get are screen name [_screen_name_], number of followers [_followers_count_] and the total number of tweets [_statuses_count_]. There is a range of other properties returned like the user icon, background image, profile colours and more - check out the _user / show _Twitter api to all.

Then in the next line is a function called _getTweets();_ this function is called to append the Tweets. The reason it is called in the _$.getJson() _method is because if they were both called in the document ready at the same time they could append the profile and tweets in different orders. In this case it is made sure the profile is at the top.

The _getTweets_ function works in the same way, except it queries the _user_timeline._ Insert the screen name and use the _count_ parameter to limit the number of tweets returned. The _$.each()_ method is used to loop through the array returned much like a _for_ loop. The first parameter is the JSON object (_tweetData_) and then the callback function uses _i_ to count the number of loops and the _tweet_ stores each array item.&nbsp;We use the properties _text_ which gets a tweet, the _location_ and _created_at_ which gets the time of the tweet. The tweets are&nbsp;concatenated&nbsp;into one string variable and then appended to the HTML element.

Additional functions are _urlToLink()_ and _calcTime()_ to improve the usability of the tweet feed. _UrlToLink _simply looks for a URL in the parsed text and turns it into a link. It uses the JavaScript _replace_ method to convert it using Regex to find the URL.

Then _calcTime()_ is used to convert the returned time to the location of the tweet and convert it to real time. Unfortunately the location of the tweet is manual at the moment, even though you can get the _location_ and _utc offset_ of the tweet, its the daylight saving time (DST) that is cause of the issue. If you can live with being out by an hour or so then you can replace the second and third parameter with _tweet.location_ and _tweet.user.utc_offset._ As far as I am aware there is no JavaScript method or service that can return whether the tweet was during DST or not. You can of course write your own function or I did find this function already done which works out DST ([WorldClock][4]), if you are interested you can add this script in. It would be much easier if the twitter api included the DST but they do provide a lot of data already.

The _calcTime_ uses two JavaScript function to work out time difference:

* _getTimezoneOffset()_ which is returns the clients machine time difference but not including DST.
* _getTime()_ this returns the dates in microseconds.

The tweet date with the offset added on and the current date is converted to microseconds. The difference is calculated and converted back to seconds by dividing by 1000. &nbsp;Then we run the value against some conditions and check if its less than a minute ago or hour ago and so on.

This script has now been further developed check out, [Create a twitter feed using JSON][6].

{% highlight javascript %}
$(document).ready(function() {
    var twitterBox = $("#twitterBox");
    $.getJSON("http://api.twitter.com/1/users/show.json?screen_name={insertUserName}&callback=?", function(tweetdata) {
      twitterBox.append("<p id=\"twitterUser\"><a onclick=\"newWin(this.href);return false;\" href=\"http://twitter.com/"+tweetdata.screen_name+"\">@"+tweetdata.screen_name+"</a><br/>Followers: "+tweetdata.followers_count+" Tweets: "+tweetdata.statuses_count+"</p>\n");
      getTweets();
    });
});

function getTweets(){
 var twitterBox = $("#twitterBox");
 $.getJSON("http://api.twitter.com/1/statuses/user_timeline.json?screen_name={insertUserName}&count=10&callback=?", function(tweetdata) {
  strTw = "";
  strTw += "<ul id=\"tweet-list\">\n";
  // For each item returned in tweetdata
  $.each(tweetdata, function(i,tweet) {
   // Append the info in li tags to the ul, converting any links to HTML <a href=.. code and convert the tweeted date
   // to a more readable Twitter format
         strTw += "<li>" + urlToLink(tweet.text) + "<p class=\"tweettime\">" + calcTime(tweet.created_at, 'London', '+1') + "</p></li>\n";
    });
  strTw += "</ul>\n";
  twitterBox.append(strTw);
 });
}

function newWin(href){
 window.open(href, "_blank");
}

// Converts any links in text to their HTML <a href=""> equivalent
function urlToLink(text) {
 var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
 return text.replace(exp,"<a onclick=\"newWin(this.href);return false;\" href=\"$1\">$1</a>");
}

// function to calculate local time
// in a different city
// given the city's UTC offset

function calcTime(strDate, city, offset) {
 d = new Date(strDate);

 // convert to msec
 // add local time zone offset
 // get UTC time in msec
 utc = d.getTime() + (d.getTimezoneOffset() * 60000);

 // create new Date object for different city
 // using supplied offset
 nd = new Date(utc + (3600000*offset));

 var parsed_date = nd.getTime();
 var timeago = parseInt((new Date().getTime() - parsed_date) / 1000);

 if (timeago < 60) return 'less than a minute ago';
 else if(timeago < 120) return 'about a minute ago';
 else if(timeago < (45*60)) return (parseInt(timeago / 60)).toString() + ' minutes ago';
 else if(timeago < (90*60)) return 'about an hour ago';
 else if(timeago < (24*60*60)) return 'about ' + (parseInt(timeago / 3600)).toString() + ' hours ago';
 else if(timeago < (48*60*60)) return '1 day ago';
 else return (parseInt(timeago / 86400)).toString() + ' days ago';
}
{% endhighlight %}

[2]: http://dev.twitter.com/doc "Twitter documentation API"
[3]: http://api.jquery.com/jQuery.getJSON/ "Get JSON method - JQuery"
[4]: http://www.proglogic.com/code/javascript/time/worldclock.php
[6]: /web-development/create-your-twitter-feed-using-json/
