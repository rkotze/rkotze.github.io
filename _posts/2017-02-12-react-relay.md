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

**Why use it:** One typical issue found in an SPA are the number of network calls made to render a page. Quickly this starts to affect your server performance because the requests made can be high. Relay is focused around efficient network calls helping to mitigate this issue. Another good feature is the queries are close to the components making it obvious the data requirements.

<!--more-->

## Relay methods

Lets imagine you have a simple commenting feature and GraphQL side is setup to handle queries for user comments.

I'll try to put the use of the Relay methods in order of request made to an application. The first thing that will get hit is the `RootContainer`.

**Relay.RootContainer** is a React component that is going to resolve all the _queries_ for a Relay route. In this case the `CommentsRoute` defined in snippet 2.

{% highlight javascript %}
import CommentsStore from 'containers/comment-store';

ReactDOM.render(
  <Relay.RootContainer
    Component={CommentsStore}
    route={new CommentsRoute()}
  />,
  document.getElementById('comment-section')
);
{% endhighlight %}
_Snippet 1_ example of `RootContainer`.

**Relay.Route** Defines a set of root queries and input parameters as objects that get sent to graphQL. The key in the `queries` object should be the same as the fragment key defined further down in the container of snippet 3. Useful thing to note is `CommentsStore` **component** is passed in on the `queries.store` callback giving us access to its _GraphQL fragment_.

{% highlight javascript %}
class CommentsRoute extends Relay.Route {
  static routeName = 'Comments';
  static queries = {
    store: (CommentsStore) => Relay.QL`
      query CommentStoreQuery {
        store { ${CommentStore.getFragment('store')} },
      }
    `,
  };
}
{% endhighlight %}
_Snippet 2_ example of creating a `Route`

**Relay.Containers** are [higher-order components](/coding/understanding-higher-order-components) which provide a declarative way to specify the data shape for a component. Important to remember
that these are _fragments_ use later to _construct a query_. Meaning the container does not preform a network request but provides the data requirements only.

The key defined in the `fragments` object is the same key mapped onto the props of the component. The `CommentsStore` component will now have `this.props.store`.

{% highlight javascript %}
import Comment from 'container/comment';
class CommentsStore extends React.Component {
  render() {
    return <ul>
      {this.props.store.comments.map(
        commentData => <Comment>CommentData</Comment>
      )}
    </ul>;
  }
}
CommentsStore = Relay.createContainer(CommentsStore, {
  fragments: {
    store: () => Relay.QL`
      fragment on Store {
        comments { ${Comment.getFragment('comment')} },
      }
    `,
  },
});
{% endhighlight %}
_Snippet 3_ example of `createContainer` and `QL`

**Relay.QL** Used for creating different queries, e.g Relay fragments, mutations and queries. These queries are transformed into JavaScript objects used by Relay to manage data fetching.

Common use of `Relay.QL` is in conjunction with containers to compose fragments. These can be imported into a parent container promoting reuse and is achieved by using the **Containers.getFragment** method. You can see this in snippet 3 in `CommentsStore`, `comments { ${Comment.getFragment('comment')} }`.
