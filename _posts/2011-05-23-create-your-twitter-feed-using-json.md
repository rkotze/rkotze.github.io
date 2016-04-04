---
layout: post
title:  Create your twitter feed using JSON
date:   2011-05-23 17:00:12 +0000
permalink: /coding/create-your-twitter-feed-using-json
category: coding
meta_description: >
 Create your own twitter feed by saving a copy locally and using it to generate it for better user interaction and speed response. 
---

This is carrying on from a previous post [Twitter Feed using JQuery JSON][1]. Originally, I just used _JQuery JSON_ method to query the _Twitter API_ which got essential bits of a user profile and their time line. It only returned the latest ten results which is sufficient enough with the nature of twitter, tweets get old quick but some are worth checking again. With the Twitter API there is no guarantee to get the exact amount of tweets you requested. What is new in this revised edition of the twitter feed is it will now take the tweets and save a local version of it. This has plenty of benefits like quicker response when querying, view older posts, improved usability and you can customise the output how ever you like. Here is a list of what is new:

* Store the tweets locally
* Pagination, to view older tweets with side shift animation
* See if a post has been retweeted
* The feed has an expiry date of four hours to update with new tweets

**How have saved the tweets locally?** I used _JQuery AJAX_ method to call a _PHP_ script to save in a&nbsp;_JSON file_. The trick is collecting the tweet data and sending it to the PHP file without the encoding messing up. In the tweets there could be special characters that need to be escaped and encoded, especially if there is a _double quote_ in a tweet. The double quote is used in a _JSON object_ as a property or string value, so if its in the tweet is has to be escaped. To escape the double quotes I wrote a short function which uses a Regular expression to find them all in a tweet.

{% highlight javascript %}
function escapeDQuotes(text){
 var exp = /(")+/g
 return text.replace(exp, '\\"');
}
{% endhighlight %}

Other special characters like the ampersand need to be encoded as this is used as a separator when sending data. JavaScript provides the function _encodeURIComponent()_ that is used to encode these special characters. I put everything together by creating an object and then using a JavaScript&nbsp;_JSON _method _stringify_ to convert it into a JSON formatted string. The _JQuery JSON_ method has a complete property with a callback function calling a method to convert the object into JSON and the AJAX function is used to save it locally.

{% highlight javascript %}
function getTwitterData(){
 var feedData = "";
 var tweetBox_json = new Object;
 $.getJSON("http://api.twitter.com/1/users/show.json?screen_name="+userProfile+"&callback=?", function(tweetdata) {
  tweetBox_json.profile = new Object;
  tweetBox_json.profile.screen_name = tweetdata.screen_name;
  tweetBox_json.profile.name = tweetdata.name;
  tweetBox_json.profile.followers_count = tweetdata.followers_count;
  tweetBox_json.profile.statuses_count = tweetdata.statuses_count;
  tweetBox_json.profile.friends_count = tweetdata.friends_count;
 })
 .complete(function(){
  tweetBox_json.tweets = new Array;
  $.getJSON("http://api.twitter.com/1/statuses/user_timeline.json?screen_name="+userProfile+"&count=100&callback=?", function(tweetdata) {
   // For each item returned in tweetdata
   $.each(tweetdata, function(i, tweet) {
    tweetBox_json.tweets[i] = new Object;
    tweetBox_json.tweets[i].text = encodeURIComponent(escapeDQuotes(tweet.text));//
    tweetBox_json.tweets[i].created_at = new Date(tweet.created_at);
    tweetBox_json.tweets[i].location = tweet.user.location;
    tweetBox_json.tweets[i].retweeted = tweet.retweeted;
    tweetBox_json.tweets[i].retweet_count = tweet.retweet_count;
   });
  })
  .complete(function(){
   //parse data to ajax function
   feedData = "t="+JSON.stringify(tweetBox_json);
   //$("#twitterBox").append(feedData+"<hr/>");
   SaveToTwitterFeed(feedData);
  });
 });
}

function SaveToTwitterFeed(feedData){
 $.ajax({
    type: "POST",
    url: "SaveTwitterFeedJSON.php",
    data: feedData,
    success: function(msg){
   $("#updateFeed").append("saved!" + msg );
   return true;
    }
 });
}
{% endhighlight %}

The PHP file is a fairly simple script. It takes the parsed data and used a method _json_decode()_ which takes a JSON formatted string. This converts the string into a JSON object and we then add a last update date and an expiry date to it. Once happy with the object I run it through the function _json_encode()_ to put it back in a string and save it into a file.

{% highlight javascript %}
$t = $_POST['t'];
$t = json_decode($t);
$t->file->lastModified = date("Y-m-d H:i:s");
$t->file->expires = add_date(date("Y-m-d H:i:s"), 0, 0, 0, 4);
$fp = fopen('results.json', 'w');
fwrite($fp, json_encode($t));
fclose($fp);
//date function to add time for expiry
function add_date($givendate,$day=0,$mth=0,$yr=0,$hr=0) {
    $cd = strtotime($givendate);
    $newdate = date('Y-m-d H:i:s', mktime(date('H',$cd)+$hr,
    date('i',$cd), date('s',$cd), date('m',$cd)+$mth,
    date('d',$cd)+$day, date('Y',$cd)+$yr));
    return $newdate;
}
{% endhighlight %}

Now with a standard request to the newly created JSON file we just check to see if the document has expired to run the whole process again else generate the Twitter Feed. Outputting the feed has not changed much from the previous example but we are no longer using the JQuery _$.each_ function, I have replaced it with a standard _for loop_ because we need to control the start point and limit for the pagination. I have two simple functions _tweetNext()_ and _tweetPrevious()_ which adjust the start point and limit for the tweets. This also includes the _JQuery animate_ function for the shift side effect. Note: The CSS has changed slightly,

* The twitterBox now has an _overflow:hidden_
* The tweet-list _position:relative_

{% highlight javascript %}
function tweetPrevious(){
 if(startRow != 0){
  $("#tweet-list").animate({
   left: '+300',
  }, function(){
   $("#tweet-list").css("left", "-300px");
   startRow = (startRow - setPageLimit);
   limit = (limit - setPageLimit);
   justTweets(limit, startRow);

   $(this).animate({
    left: '0'
   });
  });
 }
}

function tweetNext(){
 if((limit + setPageLimit) < tweetData.tweets.length){
  $("#tweet-list").animate({
   left: '-300',
  }, function(){
   $("#tweet-list").css("left", "+300px");
   startRow = (startRow + setPageLimit);
   limit = (limit + setPageLimit);
   justTweets(limit, startRow);

   $(this).animate({
    left: '0'
   });
  });
 }
}
{% endhighlight %}

As you can see it is now calling a function called _justTweets(limit, startRow)_ and this reads the global variable that has been set with tweets and outputs them into the _tweet-list_. The function _local_getTweets()_ gets the data from the JSON file and sets the global twitter variable.

{% highlight javascript %}
function justTweets(limit, startRow){
 var listTweets = tweetData.tweets;
 var tweetLimit = (limit == 0) ? listTweets.length : limit;
 var strTw = "";
 for(var i = startRow; i < tweetLimit; i++){
  strTw += "<li>" + urlToLink(listTweets[i].text) + "<p class=\"tweettime\">Retweeted: " + listTweets[i].retweet_count + ", " + calcTime(listTweets[i].created_at, listTweets[i].location, '+1') + "</p></li>\n";
 }
 totalPages = parseInt(listTweets.length / setPageLimit);
 pageNumber = parseInt(limit / setPageLimit);
 $("#tweet-list").html(strTw);
 $(".tweetCount").html(pageNumber+"/"+totalPages);
}

function local_getTweets(){
 $.getJSON("results.json", function(tweetdata) {
  tweetData = tweetdata;

  if(new Date(tweetdata.file.expires) < new Date()){//check if expired
   getTwitterData();
  }
  twitterBox.append("<p id=\"twitterUser\"><a onclick=\"newWin(this.href);return false;\" href=\"http://twitter.com/"+tweetdata.profile.screen_name+"\">@"+tweetdata.profile.screen_name+"</a><br/>Followers: "+tweetdata.profile.followers_count+" Tweets: "+tweetdata.profile.statuses_count+"</p>\n"+
   "<p class=\"scrollBtns\"><a onclick=\"tweetPrevious(); return false;\" href=\"\">Previous</a> <span class=\"tweetCount\"></span> <a onclick=\"tweetNext(); return false;\" href=\"\">Next</a></p>");

  twitterBox.append("<ul id=\"tweet-list\"></ul>\n");
  justTweets(limit, startRow);
 });
}
{% endhighlight %}

This twitter feed does have a lot of work left on it but for now this is good enough for anyone to take and play around with. I will be working on it some more and hopefully come out with some new improved features. [Download full demo code zipped up][2] or view the demo of the [Twitter Feed][3].&nbsp;Enjoy.

[1]: /twitter-feed-using-jquery-json/
[2]: /demo/twitterfeed-v1.5.zip "Download twitter feed zip"
[3]: /demo/twitterfeed-v1.5.php "Demo of twitter feed"
  