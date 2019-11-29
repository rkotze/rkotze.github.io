---
layout: post
title: "Securely manage JWT tokens for a React app"
date: 2019-11-29 06:00:12 +0000
permalink: /coding/jwt-secure-client-react-graphql
category: coding
full_image_url: https://user-images.githubusercontent.com/10452163/69498077-e4f35380-0edb-11ea-820a-627f259180b9.jpg
meta_description: >
  How to store JWT tokens securely for a React App to communicate to Apollo GraphQL server
excerpt_separator: <!--more-->
tags: javascript react node graphql tutorial
---

# Using HTTPOnly cookies for JWT GraphQL server

Apollo play ground settings: "request.credentials": "include"

On the server:
- Add cookie parser
- Add the cors middleware, add domain and set to true
- ApolloServer and middleware set cors to false
- Update login to create httpOnly Cookies
- Middleware to read from cookies

Client-side
- Remove the fetch and request interceptors
- Add credentials includes
- Have a logged in indicator (maybe local storage)

This is the continuation of [JWT for authentication using Apollo Graphql server](/coding/json-web-tokens-using-apollo-graphql) and will show an example of how to send <abbr title="JSON web token">JWT</abbr>s for each request from the client to the GraphQL server, and how to handle updated tokens when a user returns for a new session in the client.

This tutorial will focus on the **key** features needed to send and receive tokens, meaning there is no _complete example_ output to try at the end. The aim is to help you integrate authentication into your own app.

<!--more-->

Parts that change

### Login and store tokens

```
mutation Login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    refreshToken
    accessToken
  }
}

mutation Login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    id
    name
    username
  }
}
```



```javascript
// module for saving tokens to local storage
const TOKEN_KEY = "stampTokens";
// tokens = { accessToken: "xyz", refreshToken: "abc" }
export function saveTokens(tokens) {
  localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
}

export function getTokens() {
  return JSON.parse(localStorage.getItem(TOKEN_KEY));
}

export function deleteTokens() {
  localStorage.removeItem(TOKEN_KEY);
}
```


```javascript
import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { saveTokens } from "./manage-tokens";

function LoginForm() {
  const [loginDetails, setLoginDetails] = useState({
    username: "",
    password: ""
  });

  const [login, { data }] = useMutation(gql`
    mutation Login($username: String!, $password: String!) {
      login(username: $username, password: $password) {
        refreshToken
        accessToken
      }
    }
  `);

  async function submitLogin(e) {
    e.preventDefault();
    const { data } = await login({ variables: loginDetails });
    if (data && data.login) {
      saveTokens(data.login);
    }
  }

  return (
    <form onSubmit={submitLogin}>
      {/* input fields for username and password call setLoginDetails */}
    </form>
  );
}
```

After saving, you will need to update your web app to show that the user has successfully logged in.

### Send tokens on each request

Below is the main entry file to render your app. When you create a new `ApolloClient` you can configure it to **intercept requests** sent to the server. The `request` property allows you to attach headers before the request is sent by using `operations.setContext` and supplying the headers `x-access-token` and `x-refresh-token`. We can get the tokens using the `getTokens` function which reads from local storage. This data will only be available if a user has successfully logged in. For the **request interceptor** to work your main _app_ module needs to be wrapped in the `ApolloProvider` and supplied an `ApolloClient`.

```javascript
// main entry file to render app
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { getTokens } from "./manage-tokens";

const client = new ApolloClient({
  uri: '/graphql',
  request: operation => {
    const tokens = getTokens();
    if (tokens && tokens.accessToken) {
      operation.setContext({
        headers: {
          "x-access-token": tokens.accessToken,
          "x-refresh-token": tokens.refreshToken
        }
      });
    }
  }
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
```

### Update client with new tokens

When the user returns for a different session to your app, the access token would have expired but the refresh token will still be valid. On successful response from the GraphQL server, a new "refreshed" access and refresh tokens will be returned in the headers. These will need to be read and saved in the browser local storage.

Below _Apollo Boost_ allows you to change the **fetch** implementation. This means you can use the native browser `fetch` API to access the **headers** and save to local storage.

Only certain headers can be read by the client and in the previous post this is handled. [How to make custom headers accessible for the client](/coding/json-web-tokens-using-apollo-graphql#express-middleware-to-validate-tokens).

```javascript
import { saveTokens } from "./manage-tokens";

// ...

const client = new ApolloClient({
  uri: '/graphql',
  fetch: async (uri, options) => {
    const initialRequest = await fetch(uri, options);
    const { headers } = initialRequest;
    const accessToken = headers.get("x-access-token");
    const refreshToken = headers.get("x-refresh-token");
    if (accessToken && refreshToken) {
      saveTokens({
        accessToken: accessToken,
        refreshToken: refreshToken
      });
    }
    return initialRequest;
  },
  request: operation => {
   // you have done this part
  }
});

// ...
```

### Access authorised GraphQL endpoint

You should now be able to call an authorised GraphQL endpoint and successfully get the data. For example, the component below runs the GraphQL query to fetch logged in user data:

```javascript
function FetchUserProfile(){
  const { loading, data } = useQuery(gql`
    query {
      loggedInUser {
        name
        username
      }
    }
  `);

  if(loading) return <Loading />

  if(data.loggedInUser) return <UserProfile data={data.loggedInUser} />

  return <p><a href="/sign-in">Sign in</a></p>
}
```



If you have any feedback please write in the comments below or [tweet me](https://twitter.com/share?text=Send JWT tokens from client to GraphQL server @richardkotze &url=https://www.richardkotze.com/coding/send-jwt-client-apollo-graphql&hashtags=javascript,reactjs,graphql){:target="\_blank" rel="noopener"}.
