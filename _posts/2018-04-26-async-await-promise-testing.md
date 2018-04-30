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

## Using promises

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

Example of **promises** to fetch Github profile and repositories.

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

This is probably more understandable than trying to use callbacks only. However, you still need to understand the promise API for this code to be 100% clear. This is probably fine for most developers proficient in JavaScript, as promises have been around for quite some time.

Learm more about Promises [on Mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise){:target="\_blank"} and [JavaScript info](https://javascript.info/promise-chaining){:target="\_blank"}.

## Using **async/await**:

In _ES7_ async and await keywords are available. These need to be used together for resolving asynchronous actions. Importantly `await` must be used within an `async` function and can not be used on its own. An interesting feature is `async/await` are compatible with promises. If a function returns a promise you can use the `await` to resolve it or if the function returns `await` it is possible to use `.then`.

Basics of `async/await`

```javascript
async function resolveMyDatas() {
  const datas = await fetchDatas('/a');
  return await fetchMoreDatas('/b/' + datas.id);
}
```

Example of **async await** to fetch a Github profile and repositories.

```javascript
async function fetchGitProfile(username) {
  let profile = await fetch(`https://api.github.com/users/${username}`);
  let { bio, 
       company, 
       followers, 
       following, 
       repos_url 
      } = await profile.json();
  
  return {
    bio,
    company,
    followers,
    following,
    repos_url
  };
}

async function includeGitRepos(repoUrl){
  const repo = await fetch(repoUrl)
    .then((data) => data.json());
  
  return repo.map(({name, stargazers_count}) => ({
    name,
    stargazers_count
  }));
}

async function resolveGithubProfile() {
  const profile = await fetchGitProfile('rkotze');
  const repoList = await includeGitRepos(profile.repos_url);
  console.log({
     ...profile,
     repoList
   });
};

resolveGithubProfile();
```

In the example above, you can see in `includeGitRepos` function that it is possible to mix in promises with the `await` keyword, `await fetch(repoUrl).then((data) => data.json());`. It is less obvious if you are not familiar with `fetch` API, but this is also returning a promise. 

Since it is easy to mix the two approaches it is probably best not to within a function for consistency reasons. Instead of using the `.then()` inside of an `async/await` function use `await` to resolve all promises.

It is evident `async/await` is syntax sugar for promises because the return object of one of these functions is a promise. Notably the code is cleaner making it easy to read and should be easy to migrate from promises.

### Resolve multiple async calls

In the situation where you don't depend on resolve a fetch to start another, then there is no need to `await` each fetch. Instead you can trigger them in **parallel** and resolve each of them after the request have been made.

```javascript
async function resolveProfilesInParallel() {
  const rkotzePromise = fetchGitProfile('rkotze');
  const octocatPromise = fetchGitProfile('octocat'); 
  const rkotze = await rkotzePromise;
  const octocat = await octocatPromise; // this will complete in the same time as the one above.
  return "done!";
}
```