---
layout: post
title: "Search for posts on Jekyll blog"
date: 2020-02-10 06:00:12 +0000
permalink: /coding/search-posts-jekyll-blog
category: coding
published: true
full_image_url: "https://user-images.githubusercontent.com/10452163/74111687-79418e00-4b8e-11ea-85ef-74fe4b76347e.jpg"
meta_description: >
  Show examples of how I added search to my Jekyll blog
excerpt_separator: <!--more-->
tags: javascript tutorial
---

Now that I've written a lot of posts I thought it would be good to add search functionality. I have created the first iteration of my search, give a try. You should be able to find it on the left hand side. For context my blog is statically generated using [Jekyll](https://jekyllrb.com/){:target="\_blank" rel="noopener"} meaning every possible page to render is compiled ready to be served as just client-side code HTML, CSS and JavaScript. Essentially no queries to a database are made on request for a page. How can I added dynamic search that content? 

<!--more-->

![sway bridge across mountain forest](https://user-images.githubusercontent.com/10452163/74111687-79418e00-4b8e-11ea-85ef-74fe4b76347e.jpg)
_Photo by Kevin Mueller on Unsplash_

My first thoughts were around using vanilla JavaScript filtering on a JSON document that referenced all the posts. Using the [Liquid open-source template](https://shopify.github.io/liquid/){:target="\_blank" rel="noopener"} language my blog uses, I was able to generate the necessary JSON object. I've found Liquid easy to code and the documentation is good enough to help get unstuck. Below is the code snippet:

```
{ "posts": [{ for post in site.posts }
    {
      "title": "{ { post.title } }",
      "excerpt": "{ { post.excerpt | strip_html | strip_newlines | escape } }",
      "publishDate": "{ { post.date } }",
      "url": "{ { site.url } }{ { post.url } }",
      "tags": "{ { post.tags | join: ' ' } }"
    } { if post != site.posts.last }, { endif } { endfor } ]}
```

[`article-data.json` file on GitHub](https://github.com/rkotze/rkotze.github.io/blob/05f157c77ec759ba5360afc4c2cd0e9a53aa2ffe/article-data.json){:target="\_blank" rel="noopener"}

I then started looking for a fuzzy search library and found one that looked really promising. [Fuse.js](https://fusejs.io/){:target="\_blank" rel="noopener"} is a fuzzy search library written in JavaScript and it has no dependencies - which is quite neat as it avoids a potential crazy dependency chain. Fuse has a few options that you can apply which affect how the search performs and I found the following configuration worked best for me.

The _important_ properties are `tokenize: true`, `matchAllTokens: true` and `threshold: 0` - which essentially means it has to match any _word(s)_ for it to show rather than the individual characters. This seemed to give best results. However, the keyword testing was limited. The `keys` property is to tell Fuse which properties in the list to query against.

```javascript
function search(text, searchData) {
  const options = {
    tokenize: true,
    matchAllTokens: true,
    threshold: 0,
    includeMatches: true,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: ["title", "excerpt", "tags"]
  };
  const fuse = new Fuse(searchData.posts, options);
  return fuse.search(text);
}
```

Design wise I decided to show the results in the right hand column (where you are reading this post) when someone starts typing in the search field. I pre-load the search results on each page load and then the search is done in memory. Since this is the first iteration it seems fine for now, but I would like to optimize this approach.

```javascript
document.addEventListener(
  "DOMContentLoaded",
  async function() {
    const postSearch = document.getElementById("PostSearch");
    const searchData = await fetchSearchData();
    postSearch.addEventListener("keyup", handlePostSearch(searchData), false);
  },
  false
);
```

I wait for the whole HTML document to load by listening to [`DOMContentLoaded`](https://developer.mozilla.org/en-US/docs/Web/API/Window/DOMContentLoaded_event){:target="\_blank" rel="noopener"} event. Fetch the JSON document and listen to `keyup` event on the search input field. When a user types two or more characters the search starts to render in the right hand column.

The search results are built by creating each element `document.createElement("article")` and appending it to the main content area `id="MainContentArea"`. You can check out the [search code on GitHub](https://github.com/rkotze/rkotze.github.io/blob/master/scripts/rk.js#L1-L88){:target="\_blank" rel="noopener"}. 

It will be great to know what you think, so if you've got a moment go ahead and [tweet it](https://twitter.com/share?text=Search for posts on Jekyll blog by @richardkotze &url=https://www.richardkotze.com/coding/search-posts-jekyll-blog&hashtags=javascript,reactjs,coding){:target="\_blank" rel="noopener"} or comment below.
