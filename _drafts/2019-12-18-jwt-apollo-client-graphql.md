---
layout: post
title: "Send JWT tokens from client to GraphQL server"
date: 2019-11-20 06:00:12 +0000
permalink: /coding/send-jwt-client-apollo-graphql
category: coding
full_image_url: https://user-images.githubusercontent.com/10452163/68999707-54ee5200-08bc-11ea-90dd-4509735e0b22.jpg
meta_description: >
  How to send JWT tokens to an Apollo GraphQL server for authentication
excerpt_separator: <!--more-->
tags: javascript node graphql tutorial
---

This is the continuation of [JWT for authentication using Apollo Graphql server](/coding/json-web-tokens-using-apollo-graphql) and will show an example of how to send <abbr title="JSON web token">JWT</abbr>s for each request from the client to the GraphQL server, and how to handle updated tokens when a user returns for a new session in the client.

<!--more-->

This tutorial will focus on the **key** features needed to send and receive tokens, meaning there is no _complete example_ output to try at the end. The aim is to help you integrate authentication into your own app.

In the examples below I use [Apollo Boost](https://github.com/apollographql/apollo-client/tree/master/packages/apollo-boost){:target="\_blank" rel="noopener"} and [Apollo React Hooks](https://www.apollographql.com/docs/react/api/react-hooks/){:target="\_blank" rel="noopener"}.

```
npm i apollo-boost @apollo/react-hooks
```

1. [Login and store tokens](#login-and-store-tokens)
1. [Send tokens on each request](#send-tokens-on-each-request)
1. [Update client with new tokens](#update-client-with-new-tokens)
1. [Access authorised GraphQL endpoint](#access-authorised-graphql-endpoint)

### Login and store tokens

With the login **GraphQL mutation** below you can see it will return refresh and access tokens. This data will need be saved somewhere on the client.

```
mutation Login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    refreshToken
    accessToken
  }
}
```

These functions will be used to manage the tokens object which will be saved in the browser local storage.
The native JSON functions are used to handle storing of the token object, since local storage only saves data as a string.

Keeping your tokens secure, localStorage is might not the place. Have a read through this: [Is it safe to store a jwt in localStorage with reactjs?](https://stackoverflow.com/questions/44133536/is-it-safe-to-store-a-jwt-in-localstorage-with-reactjs)

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

Below is an example component which is missing the _username_ and _password_ input fields, as I want focus on the important functions. Essentially we call the mutation when the form is submitted, and take the user login details from the component state. A successful response from `await login` will return a `data.login` object containing the tokens and is saved using `saveTokens`.

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
      // input fields for username and password call setLoginDetails
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

That should be all that is needed to fetch data from an authenticated GraphQL endpoint.
If you have any feedback please use the comments below or tweet me.

Thanks for reading.
