---
layout: post
title: "Working with promises and async/await"
date: 2018-04-15 12:00:12 +0000
permalink: /coding/promises-and-async-await
category: coding
published: false
meta_description: >
 Learn about ES7 async and await 
excerpt_separator: <!--more-->
---

This post is going to give you lots of code examples of **promises** and _ES7_ **async/await**.

<!--more-->

What do promises solve in our code?

Whenever you wanted to resolve some data asynchronously it has to be done via a callback. What this led to in complex applications is known as "callback hell", when the first data fetch was resolved another data fetch needs to happen after. This would repeat a few times, creating a "nice" sideways pyramid in your code.

Promises mostly solved that problem by chaining. Each step resolved data and pass it along to the next function known as a `then`.

Example of the **promise** api:

```javascript
new Promise(function(resolve, reject) {
  // if OK
  resolve(data);
  // if ERROR
  reject(error);
}).then(function(data) {
  return turtle;
}).then(function(turtle) {
  return turtleToRat
}).catch(function(error) {
  // handle an error
});
```

The `fetch` function is available in most browsers and returns a promise. In the example there are two functions, one fetches a Github user and the other gets the users repositories. This builds an Github profile object containing the user profile information and array of repositories.

Example of **promises** to fetch Github profile

```javascript
function fetchGitProfile(username){
  return fetch(`https://api.github.com/users/${username}`)
    .then((data) => data.json())
    .then(({bio, company, followers, following, repos_url}) => ({
      bio,
      company,
      followers,
      following,
      repos_url
    }));
}

function includeGitRepos(user){
  return fetch(user.repos_url)
    .then((data) => data.json())
    .then((data) => data.map(({name, stargazers_count}) => ({
      name,
      stargazers_count
    })))
    .then((repoList) => {
      return {
        ...user,
        repoList
      };
    });
}

function log(data) { 
  console.log(data);
}

fetchGitProfile('rkotze')
   .then(includeGitRepos)
   .then(log);
```

This is more probably more understandable than trying to use callback only. However, you still need to understand the promise API for this code to be 100% clear. It's probably fine for most proficient in JavaScript, as promises have been around for quite some time.
## Using **async/await**:

In _ES7_ async and await keywords are available. These need to be used together for resolving asyncronous actions. Importantly `await` must be used within an `async` function and can not be used on its own. Another interesting feature is `async/await` are compatible with promises. If a function returns a promise you can use the `await` to resolve it or if the function returns `await` it is possible to use `.then`.

Example of `async/await`

```javascript
async function resolveMyDatas() {
  await fetchDatas('/a');
  return await fetchMoreDatas('/b');
}
```

Example of **async await** to fetch Github profile.

```javascript

```
