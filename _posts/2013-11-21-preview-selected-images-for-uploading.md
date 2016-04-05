---
layout: post
title:  Preview selected images for uploading using JavaScript / jQuery
date:   2013-11-21 17:00:12 +0000
permalink: /top-tips/preview-selected-images-for-uploading
category: top-tips
meta_description: >
 Explain and show example of how to preview selected images before upload using JavaScript / jQuery.
---

This is the&nbsp;continuation of how to [open a multi select file dialogue just using JavaScript][1].&nbsp;In this tutorial I will explain how to&nbsp;preview&nbsp;the selected files before upload.

Before we get started I have decided to just use jQuery to build this script rather than plain JavaScript simply because it will be easier and quicker. But if you are interested in a dependency free script&nbsp;let me know in the comments below and&nbsp;I will show an example with just JavaScript. Provided&nbsp;there is enough interest.

Here is the base script I'm starting off with, which slightly extends what I done in the previous tutorial which you can copy paste.

{% highlight javascript %}
(function(window, jquery){
    var $ = jquery;
    if($ !== null){
        var fup = {
            fileSelectBtn : $('<a href="">Select files</a>'),
            fileSelector: $('<input type="file" multiple="">'),
            outputArea: undefined,
            init: function(cssSelector){
                fup.outputArea = $(cssSelector);
                fup.outputArea.append(fup.fileSelectBtn);

                fup.fileSelectBtn.on("click",function(){
                    fup.fileSelector.click();
                    return false;
                });
            }
        }

        window.fileup = fup;
    }else{
        console.error("jQuery Required.");
    }
})(window, jQuery);

$(document).ready(function(){
   var fup = window.fileup;
   fup.init(".fileupload");
});
{% endhighlight %}

Here I've made a simple object for our file uploader `var fup={}` which is appended to the global window object. Then I set up the script by calling the `fup.init` function with a css selector using the standard jQuery ready method.

## Getting the selected files data

What needs to be done is to look for a _change_ event when the user has selected some files. This will call a function that we get the event data from&nbsp;to retrieve the file data.

In the init function we listen for the _change_ event on the file selector:

{% highlight javascript %}
fup.fileSelector.on("change", fup.listImages);
{% endhighlight %}

This will call our new function `listImages(evt)` on the _fup_ object:

{% highlight javascript %}
listImages: function(evt){
   var files = evt.target.files;
}
{% endhighlight %}

From the event `target.files` an array of file objects are returned that we can loop through. To complete the function I setup the ul element to output list items to and `appendTo` the `fup.outputArea`.

{% highlight javascript %}
var ul = $('<ul class="imageList"></ul>');
if(files.length &gt; 0){
    ul.appendTo(fup.outputArea);
}
{% endhighlight %}

Then loop through each selected file using _jQuery_ each function. I test if the file is of type image and use the [FileReader][2] class method `reader.readAsDataURL` which will generate a [data URL][3].

Once the image data has loaded the&nbsp;`reader.onload` event is fired and the image&nbsp;is then appended to the list and it should show the images selected. When the event is fired we use the `target.result` to get the data URL. The file object also has properties like _name_ and _size_ to add in additional file data.

{% highlight javascript %}
$.each(files, function(i, file){

   if (!file.type.match('image.*')) {
       return true;//works like continue in a normal loop
   }

   var reader = new FileReader();

   reader.onload = function(e) {
         var li = '<li>
         <img class="img-thumbnail" src="' + e.target.result + '" title="'+ escape(file.name) +'">
         <p>Name: ' + escape(file.name) +
         ' (' + file.type + ')
         size: '+ file.size + '</p></li>';
         fup.outputImages.push(li);
         ul.append(li);
    };

    reader.readAsDataURL(file);
});
{% endhighlight %}

Browser support for FileReader:

| Firefox (Gecko) | Chrome | Internet Explorer | Opera | Safari |
| --------------- | ------ | ----------------- | ----- | ------ |
| 3.6 (1.9.2) |  7 |  10 |  12.02 |  6.0.2 |

In the next tutorial we will look at&nbsp;[uploading the images&nbsp;to your website][4].

[1]: /top-tips/how-to-open-file-dialogue-just-using-javascript
[2]: https://developer.mozilla.org/en-US/docs/Web/API/FileReader
[3]: http://en.wikipedia.org/wiki/Data_URI_scheme
[4]: /top-tips/upload-multiple-images-to-web-server