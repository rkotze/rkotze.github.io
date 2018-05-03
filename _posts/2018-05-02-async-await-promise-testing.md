---
layout: post
title: "Using promises, async/await and testing"
date: 2018-05-02 12:00:12 +0000
permalink: /coding/promises-async-await-testing
category: coding
published: true
image: street-art.jpg
meta_description: >
 Learn about ES7 async/await and how they are related to Promises. Also how to unit test async code. 
excerpt_separator: <!--more-->
---

This post has lots of code examples showing **promises**, **async/await** and **unit testing** async functions. There is a coding challenge at the end to test your learning.

What do promises solve in our code?

Whenever you wanted to resolve some data **asynchronously** it had to be done via a **callback**. In complex applications this led to "callback hell", when the first data fetch was resolved another data fetch needs to happen afterwards. This would repeat a few times, creating a "nice" sideways pyramid in your code.

**Promises** mostly solved that problem by _chaining_. Each step resolved data and passed it along to the next `then` function.

<!--more-->

![Street art on a wall, Face with sun glasses](/images/street-art.jpg)
_Photo by Alex Holyoake on Unsplash_

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

The `fetch` function is available in most browsers and returns a promise. In the example below there are two functions, one fetches a Github user and the other gets the user repositories. This builds a Github profile object containing the user profile information and an array of repositories.

Example of **promises** to fetch Github profile and repositories:

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

This is probably more understandable than trying to use callbacks only. However, you _still need_ to understand the promise API for this code to be _100% clear_. This is probably fine for most developers proficient in JavaScript, as promises have been around for quite some time.

Learn more about Promises [on Mozilla](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise){:target="\_blank"} and [JavaScript info](https://javascript.info/promise-chaining){:target="\_blank"}.

## Using **async/await**:

In _ES7_ the **async** and **await** keywords are available. These need to be used together to resolve asynchronous actions. Importantly `await` must be used _within_ an `async` function and can not be used on its own. An interesting feature is that `async/await` are compatible with promises. If a function returns a promise you can use the `await` to resolve it, or if the `async` function returns it is possible to use `.then`.

Basics of `async/await`:

```javascript
async function resolveMyData() {
  const data = await fetchData('/a');
  return await fetchMoreData('/b/' + data.id);
}
```

Example of **async/await** to fetch a Github profile and repositories:

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

However, since it is easy to mix the two approaches it is probably best not to do this within a function for consistency reasons. Instead of using the `.then()` inside of an `async/await` function, use `await` to resolve all promises.

It is evident that `async/await` is syntax sugar for promises because the return object of one of these functions is a promise. Notably, the code is cleaner making it easy to read and should be easy to migrate from promises.

### Resolve multiple async calls in parallel

In the situation where you don't depend on resolving one fetch to start another, then there is no need to `await` each fetch. Instead, you can trigger them in **parallel** and resolve each of them after the request has been made:

```javascript
async function resolveProfilesInParallel() {
  const rkotzePromise = fetchGitProfile('rkotze');
  const octocatPromise = fetchGitProfile('octocat'); 
  const rkotze = await rkotzePromise;
  const octocat = await octocatPromise; // this will complete in the same time as rkotzePromise.
  return [rkotze, octocat, "done!"];
}
```

Alternatively using `Promise.all` achieves a similar effect. The result is an array in the order of the calls:

```javascript
Promise.all([fetchGitProfile('rkotze'), fetchGitProfile('octocat')]).then(function(values) {
  console.log(values);
});
```

## Unit testing

How would you unit test an `async/await` function?

Test frameworks like [Mocha JS](https://mochajs.org/){:target="\_blank"}, [Jest](https://facebook.github.io/jest/){:target="\_blank"} and [Jasmine](https://jasmine.github.io/){:target="\_blank"} support **async testing**. Below are some of the ways this is achieved:

```javascript
describe('github profile', function() {
  // mockout the fetch
  it('fetch profile rkotze', function(done) {
    fetchGitProfile('rkotze').then(function(data){
      expect(data).to.eventually.have.property("bio");
      done();
    });
  });
});
```

The example above uses the `done` callback in the `it` function to tell the framework the test is completed.

```javascript
describe('github profile', function() {
  // mockout the fetch
  it('fetch profile rkotze', function() {
    return expect(fetchGitProfile('rkotze')).to.eventually.have.property("bio");
  });
});
```

The example above supports _returning_ a promise to know when the test is complete. Also this example uses chai plugin [chai-as-promised](https://github.com/domenic/chai-as-promised){:target="\_blank"}.

```javascript
describe('github profile', function() {
  // mockout the fetch
  it('fetch profile rkotze', async function() {
    const profile = await fetchGitProfile('rkotze');
    expect(profile).to.have.property("bio");
  });
});
```

Lastly, the example above shows how to use _async/await_ within the test.

### Coding challenge

Codewars [kata for async/await](https://www.codewars.com/kata/jokes-youve-been-awaiting-for-dot-dot-dot-promise/javascript){:target="\_blank"}

### Codepen examples of:

- [**Async/await to fetch GitHub profile and repos**](https://codepen.io/rkotze/pen/jxVejY){:target="\_blank"}
- [**Promises to fetch GitHub profile and repos**](https://codepen.io/rkotze/pen/WJoXVP){:target="\_blank"}
