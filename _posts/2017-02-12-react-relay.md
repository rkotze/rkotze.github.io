---
layout: post
title:  "Understanding React Relay"
date:   2017-02-12 12:00:12 +0000
permalink: /coding/how-does-react-relay-work
category: coding
meta_description: >
 Understand how React Relay works. 
excerpt_separator: <!--more-->
---

As with any new tech it can be overwhelming and confusing how all the parts work together. Especially with the combo of Relay and GraphQL. Hopefully this post will help demystify some things in Relay.

**What is Relay:** Data driven JavaScript framework used to efficiently handle data communication between a React and a GraphQL server.

**Why use it:** One typical issue found in an SPA are the number of network calls made to render a page. Quickly this starts to affect your server performance as the request made can be really high. Relay is focused around efficient network calls helping to mitigate this issue. Another good feature is the queries are close to the components making it obvious the data requirements.

<!--more-->

**Relay.Containers** are high-order components which provide a declarative way to specify the data shape for a component. Important to remember is that these are _fragments_ use later to _construct a query_. Meaning the container does not preform a request with a query but provides the data requirements only.

**Relay.QL** Use this to create a different queries, e.g Relay fragments, mutations and queries. These queries are transformed into JavaScript objects used by Relay to manage data fetching.

On use of Relay.QL is in conjunction with containers to compose fragments. These can be imported into a parent container promoting reuse. This is achieved by using the **Containers.getFragment** method. Example below:

{% highlight javascript %}
Relay.createContainer(Foo, {
  fragments: {
    bar: () => Relay.QL`
      fragment on Bar {
        ${ChildComponent.getFragment('childFragmentName')},
      }
    `,
  }
});
{% endhighlight %}
