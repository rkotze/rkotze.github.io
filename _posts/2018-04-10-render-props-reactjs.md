---
layout: post
title: "Understanding render props"
date: 2018-04-10 12:00:12 +0000
permalink: /coding/understanding-render-props-react-js
category: coding
meta_description: >
 Understand why and how to use render props with React JS 
excerpt_separator: <!--more-->
---

In this post I will discuss the why and how to use _render props_ with [ReactJS](https://reactjs.org/).

**Why use render props:** Promote _reuse_ of behaviour across React components.

This sounds similar to [higher-order components](/coding/understanding-higher-order-components), however we will focus on render props and discuss the differences in another post.

<!--more-->

**How to use render props:** The value of a prop is assigned a function. This is called in the parent component and renders React elements. The parent component typically will handle data which is passed through the callback parameters.

Example of a basic render props component:

```javascript
// define
class FetchData extends React.Component {
  constructor(){
    super();
    this.state = {
      data: []
    };
  }
  
  componentDidMount(){
    this.setState({
      data: 'New data'
    });
  }
  
  render(){
    const { data } = this.state;
    return (
      <React.Fragment>
        {this.props.children(data)}
      </React.Fragment>
    )
  }
}

// Render

<FetchData>{(data) => {
  return <p>{data}</p>
}}</FetchData>
```
