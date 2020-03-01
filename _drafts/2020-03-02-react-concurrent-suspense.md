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

There has been plenty of interest in React Suspense with many articles and experimental code snippets to test it out. I thought I would read more about it and give my understanding of why you might want to use it. Below is my summary after reading through the React docs about [concurrent mode and Suspense](https://reactjs.org/docs/concurrent-mode-suspense.html){:target="\_blank" rel="noopener"}.

<!--more-->

![Side view of steps in all white](https://user-images.githubusercontent.com/10452163/73617558-f1043b80-4617-11ea-8b40-d8ed375c6c45.jpg)
_Photo by Stéphane Mingot on Unsplash_

## React concurrent mode

It's about making the UI more responsive and fluid for better user experience by preventing render-blocking updates. When React begins to render there is no way to stop it and begin on a higher priority change. 
With concurrent mode, it's possible to interrupt the render to show the user the latest change and preventing the UI from staggering as it updates.

Two key points for concurrent mode:

### Interruptible rendering

Works well for when user interactions are quick for example typing up a message and tagging a person in it is typically supported with a suggestion/auto-complete list. With a typical implementation, these lists can be quite jumpy for each character added but with concurrent mode, it can interrupt a render with the latest changes.

### Intentional loading sequences

When transitioning to another page there might not be enough data to render a complete loading page so it shows a blank page for a brief moment. It's possible to wait for a little on the current page and begin rendering the loader in memory first. Then update the UI with a controlled transition to prevent a jarring experience.

## React Suspense

Since **React 16.6** a new component called `Suspense` was introduced which can be used to manage the loading states while resolving async requests. This is an _experimental_ component and is likely to change so keep that in mind. The interesting thing about this component is it's unaware of any data fetching API and essentially decouples fetching data from the view layer. As mentioned in the React docs, this is **not** a ready to use data client that would replace _fetch_ API, Apollo or Relay. What it does enable is a more natural React interface to integrate ways to fetch data. Data libraries would need to implement the Suspense API for consumers to use this component.

### Suspense in practice

Typically in a React application, you would **fetch-on-render**, which is fetching data in `componentDidMount` or `useEffect` life cycles. Once data is resolved successfully update the component state to render the view.

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
2. Wait for the component to mount
3. Start fetching tweets
4. Wait to resolve tweets
5. Update state to render a list of tweets

The Suspense approach is **render-as-you-fetch** meaning you begin fetching data before the component starts to render. There is no need to use life cycle events and manage state with wrapped in the `Suspense` component.

```jsx
function TwitterTimeline() {
  // notice no async/await, just try to get tweets
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
3. If not ready _suspend rendering_
4. Fallback to loading view
5. Resolve tweets to render

The Suspense approach is noticeably different from the typical way. In code, you might feel it's easier to reason about. The removal of logic `loading` state and life cycle events reduce complexity. From the user perspective, they get a more responsive UI because we are starting to resolve data first while rendering.

This does look like a win-win for both end-users and developers. See the Code Sandbox [Suspense example by Dan Abramov](https://codesandbox.io/s/frosty-hermann-bztrp){:target="\_blank" rel="noopener"}. I would recommend reading the React docs on Suspense to get more details if you're interested.

I hope this helps you understand React Suspense and concurrent mode more. Comment on [Twitter](https://twitter.com/share?text=Why and how to use React context by @richardkotze &url=https://www.richardkotze.com/coding/why-how-use-react-context&hashtags=javascript,reactjs,coding){:target="\_blank" rel="noopener"} or below.
