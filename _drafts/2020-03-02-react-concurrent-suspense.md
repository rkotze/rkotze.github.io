---
layout: post
title: "React Suspense and concurrent mode"
date: 2020-03-01 06:00:12 +0000
permalink: /coding/react-suspense-concurrent-mode
category: coding
published: true
full_image_url: "https://user-images.githubusercontent.com/10452163/73617558-f1043b80-4617-11ea-8b40-d8ed375c6c45.jpg"
meta_description: >
  Why do you want concurrent mode and suspense?
excerpt_separator: <!--more-->
tags: javascript react
---

I have read through the React docs about concurrent mode and Suspense. Below I have written up my summary of that learning. 

<!--more-->

![Side view of steps in all white](https://user-images.githubusercontent.com/10452163/73617558-f1043b80-4617-11ea-8b40-d8ed375c6c45.jpg)
_Photo by Stéphane Mingot on Unsplash_

## React concurrent mode:

It's about making the UI more responsive and fluid for a better user experience by preventing render blocking updates. When React begins to render there is no way to stop it and begin on a higher priority change. 
With concurrent mode it's possible to interrupt the render to show the user the latest change and the UI is not staggered as it updates.

There are two key areas which concurrent mode focuses on:

Interruptible rendering

Works well for when user interactions that are quick for example tagging a person in a message is typically supported with a suggestion/auto-complete lists.

Intentional loading sequences

When transitioning to another page there might not be enough data to render a complete loading page so it's shows a blank page for a brief moment. It's possible to wait a little on the current page and begin rendering the loader in memory first. Then update the UI with a controlled transition to prevent a jarring experience.

## React Suspense

React has introduced a new component called `Suspense` which can be used to manage the loading states while resolving async requests. This is an experimental component and is likely to change. The interesting thing about this component is it unaware of any data fetching API and essentially decouples fetching data from the view layer. As mentioned in the React docs, this is **not** a ready to use client that would replace _fetch_ API, Apollo or Relay. What it does allow is a more natural React interface to integrate ways to fetch data. Data libraries would need to implement the Suspense API contract for consumers to use this component.

### Suspense in practice

Typically in a React application you would **fetch-on-render**, which is fetching data in `componentDidMount` or `useEffect` life cycle methods. Once data is resolved successfully update the component state to render the view.

Example of fetch on render:

```jsx
function ListPosts() {
  const [tweets, setTweets] = useState({
    loading: true,
    data: []
  });
  useEffect(async () => {
    const posts = await dataSource.twitter.getTweets();
    setTweets({
      loading: false,
      data: posts
    });
  }, []);

  if(tweets.loading){
    return <h1>Loading tweets...</h1>;
  }

  return (
    <ul>
      {tweets.data.map(tweet => (
        <li key={tweet.id}>{tweet.text}</li>
      ))}
    </ul>
  );
}
```

Typical flow:

1. Render loading view
2. Start fetching tweets
3. Wait to resolve tweets
4. Update state to render a list of tweets

The Suspense approach is **render-as-you-fetch** meaning you begin fetching the data as the component starts to render. There is no need to use life cycle events and manage state.

```jsx
function TwitterTimeline() {
  // Try to get tweets, although they might not have loaded yet
  const tweets = suspenseDataSource.twitter.getTweets();
  return (
    <ul>
      {tweets.map(tweet => (
        <li key={tweet.id}>{tweet.text}</li>
      ))}
    </ul>
  );
}

function ListPosts(){
  <Suspense fallback={<h1>Loading tweets...</h1>}>
    <TwitterTimeline />
  </Suspense>
}
```

Suspense flow:

1. Start fetching tweets
2. Start rendering tweets
3. If not ready suspend rendering
4. Fallback to loading view
5. Resolve tweets to render

The approach is quite different in the code and you might feel it's easier to reason about. The removal of `loading` state and life cycle events reduce the complexity. The user gets a more responsive UI because we are starting to resolve data first while rendering.

This does look like a win win for both end users and developers.

I hope this helps you use React context more effectively in your day to day coding. Comment on [Twitter](https://twitter.com/share?text=Why and how to use React context by @richardkotze &url=https://www.richardkotze.com/coding/why-how-use-react-context&hashtags=javascript,reactjs,coding){:target="\_blank" rel="noopener"} or below.
