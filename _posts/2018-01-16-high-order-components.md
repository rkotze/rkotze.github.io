---
layout: post
published: false
title:  "Understanding high order components"
date:   2018-01-16 12:00:12 +0000
permalink: /coding/understanding-high-order-components
category: coding
meta_description: >
 Understand why and how to use high order components in React JS 
excerpt_separator: <!--more-->
---

In this post I will discuss the why and how to use high order components (<abbr title="High Order Component">HOC</abbr>) in ReactJS.
It will also cover examples and conventions.

**Why use HOC:** Promote reuse of logic across React components.

Components are the typical element for reuse in React but sometimes features don't fit into this standard. There might be exact same methods used to fetch data but the display is different. See example below.

<!--more-->

**How to use HOC:** The core structure of a HOC is a function that takes a _component_ and returns a _new component_. HOC are pure functions with no side-effect because the component passed is wrapped in a new component. Typically data is passed in as props and additional props are passed through.

This is a general compositional pattern and not part of React as such.

## Examples of High order components

First will show the repeated data fetching and how we can transform it into a HOC.

```react
class VideoBlog extends React.Component {
  constructor() {
    super();
    this.state = {
      videoBlog: null
    };
  }

  componentDidMount() {
    fetch("http://example.com/videos/124").then(data => {
      this.setState({
        videoBlog: data.videoBlog
      });
    });
  }

  render() {
    return <video src={this.state.videoBlog.src} />;
  }
}

class RelatedVideos extends React.Component {
  constructor() {
    super();
    this.state = {
      videoList: []
    };
  }

  componentDidMount() {
    fetch("http://example.com/videos/related/" + this.props.videoId).then(
      data => {
        this.setState({
          videoList: data.videoList
        });
      }
    );
  }

  render() {
    return <List data={this.state.videoList} />;
  }
}
```

`VideoBlog` and `RelatedVideo` are not the same output but the implementation is similar. They both fetch data in the `componentDidMount` life cycle method.

What will the above components look like when wrapped in the HOC.

```react
const VideoBlogWithFetch = withFetch(
  VideoBlog,
  () => "http://example.com/videos/124"
);
const VideoBlogWithFetch = withFetch(
  VideoBlog,
  props => "http://example.com/videos/related/" + props.videoId
);
```

### Breakdown of the above

**First param** is the component to be wrapped by the HOC.

**Second param** is a function to build a fetch url.

The data fetched is pushed through a **prop called data** which the wrapped components can access.

This is what the `withFetch` HOC will look like:

```react
function withFetch(WrapComponent, createRequest) {
  class WithFetch extends React.Component {
    constructor() {
      super();
      this.state = {
        data: null
      };
    }

    componentDidMount() {
      fetch(createRequest(this.props)).then(data => {
        this.setState({
          data
        });
      });
    }

    render() {
      return <WrapComponent data={this.state.data} {...this.props} />;
    }
  }

  WithFetch.displayName = `WithFetch(${getDisplayName(WrapComponent)})`;
  return WithFetch;
}
```
