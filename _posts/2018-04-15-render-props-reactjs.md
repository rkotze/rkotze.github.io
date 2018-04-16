---
layout: post
title: "Understanding React JS Render Props"
date: 2018-04-15 12:00:12 +0000
permalink: /coding/understanding-render-props-react-js
category: coding
published: true
meta_description: >
 Understand why and how to use Render Props with React JS
excerpt_separator: <!--more-->
---

In this post, I will discuss the why and how to use **Render Props** with React JS.

**Why use** Render Props: Promote **reuse** of behaviour across React components.

If you have read my post on [higher-order components](/coding/understanding-higher-order-components) this may sound similar. The React community has been working hard on solving reuse across components, one common theme is _passing data to children_. However, we will focus on how to use Render Props and discuss the differences in another post.

<!--more-->

![Slovenia mountain range](/images/slovenia-mountains.jpg)
*Photo by Ales Krivec on Unsplash*

**How to use** Render Props: The **value of a prop** is assigned a **function** and is called in the component **render** method. The function defines what a _Render Prop component_ should render, allowing you to apply cross-cutting logic to any React component.

**Example** of using a Render Props:

```javascript
...
render(){
  <FetchData render={(data) => {
    return <p>{data}</p>
  }} />
}
```

The prop is called `render` and is assigned a `function` however this does not _need_ to be called `render`. Any prop on the component could be assigned a function including `this.props.children`.

**Example** of Render Props using `children`:

```javascript
...
render(){
  <FetchData>{(data) => {
    return <p>{data}</p>
  }}</FetchData>
}
```

As you can see _Render Props_ is defining what the `FetchData` component should render without having to code it directly into it. Making it versatile for rendering different React elements.

## How to build a Render Props component

The great thing about Render Props approach is it's like building any React component without the boiler code a HOC needs.

We are going to build a component that fetches contributor data for a repository from GitHub.

```javascript
class ListContributors extends React.Component {
  constructor(){
    super();
    this.state = {
      contributorList: []
    };
  }

  fetchContributors = (repoPath) => {
    fetch(`https://api.github.com/repos/${repoPath}/stats/contributors`)
      .then((data) => data.json())
      .then((data) => {
        return data.map(({ total, author }) => ({
            total: total,
            username: author.login,
            avatar: author.avatar_url,
            id: author.id
          }));
      })
      .then((contributorList) => {
        this.setState({
          contributorList
        });
      });
  }

  componentDidMount(){
    this.fetchContributors(this.props.repoPath);
  }

  render(){
    const { contributorList } = this.state;
    return (
      <div>
      {contributorList.map((contributor) => {
          return (
            <ContributorProfile {...contributor} />
          )})}
      </div>
    )
  }
}

// Usage

<ListContributors repoPath="findmypast-oss/git-mob" />
```

The above should render out a list of contributors showing author avatar, username, and total commits.

The method `fetchContributors` gets contributors from GitHub and transforms the raw JSON object to properties we care about. We then `map` through the list to render out the contributors.

What if we want to use the **same data** but with a **different view**? For example, show a graph instead of a list.

Could use an if statement to check a prop however that would grow to be unmaintainable when supporting more than two views.

Let's try refactoring the above view to use Render Props to see how that solves this problem.

### Render Props refactor

```javascript
class FetchContributors extends React.Component {
  // only changes in the render method
  ...
  render(){
    const { contributorList } = this.state;
    return (
      <React.Fragment>
        {this.props.children(contributorList)}
      </React.Fragment>
    );
  }
}

// render a list

<FetchContributors repoPath="findmypast-oss/git-mob">{
  (contributorList) => contributorList.map((contributor) => {
    return <ContributorProfile {...contributor} />
  })
}</FetchContributors>

// render a graph

<FetchContributors repoPath="findmypast-oss/git-mob">{
  (contributorList) => <ContributorsGraph contributorList={contributorList} />
}</FetchContributors>
```

The _only_ changes were made in the render method showing how similar the Render Props approach are to normal components. I also renamed the component to `FetchContributors` to better explain the behaviour of the component. Now you can see using `FetchContributors` the two different React views `ContributorProfile` and `ContributorsGraph` can access the same data.

I've built a more detailed [codepen.io example for fetching git contributors](https://codepen.io/rkotze/pen/oqqopQ){:target="\_blank"} for you to experiment with.

Read more at [React JS docs on Render Props](https://reactjs.org/docs/render-props.html){:target="\_blank"}.

## Conclusion

What we see is **Render Props** makes it easy to build **reusable components** without the boiler code of higher-order components. It's explicit as to where the props are being set from. The setup is straightforward by assigning a prop with a function which tells the component what to render.