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

## Relay methods

I'll try to put the use of the Relay methods in a logical order. Lets imagine GraphQL is setup to query for comments and we are going use Relay to get them.

**Relay.Route** Routes define a set of root queries and input parameters as objects that get sent to graphQL. The key in the `queries` object should be the same as the fragment key defined further down in the container. Useful thing to note is `CommentStore` component is passed in on the queries giving us access to its store.

{% highlight javascript %}
class CommentsRoute extends Relay.Route {
  static routeName = 'Comments';
  static queries = {
    store: (CommentStore) => Relay.QL`
      query CommentStoreQuery {
        store { ${CommentStore.getFragment('store')} },
      }
    `,
  };
}
{% endhighlight %}

**Relay.RootContainer** is a React component that is going to resolve all the _queries_ for a Relay route. In this case the `CommentsRoute` above.

{% highlight javascript %}
import CommentStore from 'containers/comment-store';

ReactDOM.render(
  <Relay.RootContainer
    Component={CommentStore}
    route={new CommentsRoute()}
  />,
  document.getElementById('comment-section')
);
{% endhighlight %}

**Relay.Containers** are high-order components which provide a declarative way to specify the data shape for a component. Important to remember is that these are _fragments_ use later to _construct a query_. Meaning the container does not preform a request with a query but provides the data requirements only.

The key of the fragment defined in the container is the same key mapped on to the props of the component. Below the key `store` defined in the container fragments object is attached to the props of `CommentStore` component.

{% highlight javascript %}
import Comment from 'container/comment';
class CommentStore extends React.Component {
  render() {
    return <ul>
      {this.props.store.comments.map(
        commentData => <Comment>CommentData</Comment>
      )}
    </ul>;
  }
}
CommentStore = Relay.createContainer(CommentStore, {
  fragments: {
    store: () => Relay.QL`
      fragment on Store {
        comments { ${Comment.getFragment('comment')} },
      }
    `,
  },
});
{% endhighlight %}

**Relay.QL** Use this to create different queries, e.g Relay fragments, mutations and queries. These queries are transformed into JavaScript objects used by Relay to manage data fetching.

Common use of Relay.QL is in conjunction with containers to compose fragments. These can be imported into a parent container promoting reuse and is achieved by using the **Containers.getFragment** method. You can see this in the above example in `CommentStore`, `comments { ${Comment.getFragment('comment')} }`.
