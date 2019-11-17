---
layout: post
title:  Upload multiple images to web server
date:   2014-06-28 17:00:12 +0000
permalink: /top-tips/upload-multiple-images-to-web-server
category: top-tips
meta_description: >
 Take the preview images and upload multiple photos to the server using AJAX
tags: javascript
---

This is a&nbsp;continuation from [preview selected images tutorial][1], I will now explain how to take the multiple selected&nbsp;file data and upload it to the server

.![Demo of upload multiple images][2]

We will be using the `FormData` object, native to JavaScript to store the raw file data which&nbsp;will be uploaded using jQuery&nbsp;AJAX.

Within the `init()` function I&nbsp;first check the browser supports `FormData` and if so the object is initialised.

{% highlight javascript %}
if(window.FormData){
     formData = new FormData();
}
{% endhighlight %}

When looping&nbsp;through the `files` array to add the photos to the&nbsp;view I also&nbsp;push this image file data into the newly created formData object. This is done in the `listImages()` function.

{% highlight javascript %}
$.each(files, function(i, file){
    ...
    if(formData){
        formData.append('images[]', file);
    }
    ...
});
{% endhighlight %}

After the images are added to the UI, I append the upload photos button which will then allow the user to upload the photos by calling the AJAX method. This is done at the end of the `listImages()` function.

{% highlight javascript %}
fup.outputArea.append(fup.fileUploadBtn);
{% endhighlight %}

I have made a new function called `imageUpload()`. When the images are submitted&nbsp;the `formData` object is added&nbsp;to the AJAX data property, this will send the raw file data to the server for&nbsp;uploading.

{% highlight javascript %}
imageUpload: function(){
     if (formData) {
         $.ajax({
            url: "uploader.php",
            type: "POST",
            data: formData,
            dataType: 'json',
            processData: false,
            contentType: false,
            success: function (res, status, jqXHR) {
               for (var prop in res) {
                   $('.'+res[prop].className).prepend('<p class="text-success"><i class="glyphicon glyphicon-ok"></i> Uploaded</p>');
               };
             }
          });
     }
     return false;
}
{% endhighlight %}

When the files have been uploaded a simple JSON object is returned with class names for each file.&nbsp;The success callback is called&nbsp;and I loop through the JSON to prepend the upload success message.

I used a simple php upload script which is&nbsp;below. I loop through the files array and check the temporary file path is not empty. Then I specify the location to upload the file to and use the `move_upload_file()` function to do that. If it is successfully uploaded I create the CSS class name based off of the file name and add it to the `$outputArr[]`. The `$outputArr[]` is then converted into JSON for the success callback in the jQuery Ajax function.

{% highlight javascript %}
$outputArr = array();
for($i=0; $i<count($_files['images']['name']); $i++)="" {="" $tmpfilepath="$_FILES['images']['tmp_name'][$i];" if="" ($tmpfilepath="" !="" ){="" $newfilepath="uploadFiles/" .="" $_files['images']['name'][$i];="" if(move_uploaded_file($tmpfilepath,="" $newfilepath))="" $classname="strtolower(preg_replace('/[^a-z0-9]/i'," '-',="" $_files['images']['name'][$i]));="" $outputarr[]="array('className'" ==""> $className);
    }
  }
}
header('Content-Type: application/json');
echo json_encode($outputArr, JSON_FORCE_OBJECT);
{% endhighlight %}

Please comment if you have any questions.

[1]: /top-tips/preview-selected-images-for-uploading
[2]: /images/multi-photo-upload.png