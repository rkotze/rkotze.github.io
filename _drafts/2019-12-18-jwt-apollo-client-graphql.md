---
layout: post
title: "Send JWT tokens from client to GraphQL server"
date: 2019-11-18 06:00:12 +0000
permalink: /coding/send-jwt-client-apollo-graphql
category: coding
full_image_url: https://user-images.githubusercontent.com/10452163/68999707-54ee5200-08bc-11ea-90dd-4509735e0b22.jpg
meta_description: >
  How to send JWT tokens to an Apollo GraphQL server for authentication
excerpt_separator: <!--more-->
tags: javascript node graphql tutorial
---

# Sending tokens from client side app

This post will show an example of how to send JSON web tokens (JWT) for each request to the GraphQL server. Also on response the tokens might have changed because the refresh token was used, meaning the tokens on the client will need to be updated. This is the second part of using [JWT for authentication using Apollo Graphql server](/coding/json-web-tokens-using-apollo-graphql).

<!--more-->

This tutorial will show the key parts needed to send and recieve tokens from your app meaning there is no complete example output to try at the end.

In the examples below I use [Apollo Boost](https://github.com/apollographql/apollo-client/tree/master/packages/apollo-boost){:target="\_blank" rel="noopener"} and [Apollo React Hooks](https://www.apollographql.com/docs/react/api/react-hooks/){:target="\_blank" rel="noopener"}.

```
npm i apollo-boost @apollo/react-hooks
```

These are the steps needed for your web app to handle authentication with the server

1. [Login and store tokens]()
1. [Send tokens on each request]()
1. [Update client with new tokens]()
1. [Access authorised GraphQL endpoint]()

### Login and store tokens

With the login **GraphQL mutation** below you can see it will return a refresh and access token. This data will need be saved somewhere on the client.

```
mutation Login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    refreshToken
    accessToken
  }
}
```

These functions will be used to manage tokens object which is saved in the browser local storage.
The native JSON functions are used to handle the storing of the token object since local storage only saves data as a string.

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

Below is an example component which is missing the username and password fields to provide focus on the important functions. Essentially we call the mutation when the form is submitted and take the user login details from the component state. A successful response from `await login` will return `data.login` object, containing the tokens which is stored using `saveTokens`.

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

After saving you will need to update your web app to show the user has successfully logged in.

### Send tokens on each request

Below is the main entry file to render your app. When you create a new `ApolloClient` you can configure it to **intercept** requests sent to the server. The `request` property allows you to attach headers before the request is sent by using `operations.setContext` and supplying the headers `x-access-token` and `x-refresh-token`. We can get the tokens from the local storage which we saved earlier when a user has logged in, using the `getTokens` function from manage tokens module. Your main app module needs to be wrapped in the `ApolloProvider` for the **request interceptor** to work.

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

The user might return a couple days later to your app and by then the access token would have expired but the refresh token will still be valid. On successful response from the GraphQL server new ("refreshed") access and refresh tokens will be returned in the headers. These will need to be updated in the browser local storage.

Below Apollo boost allows you to change the fetch implementation. This means you can use the native browser `fetch` API to access the **headers** and save to local storage.

Only certain headers can be read by the client and in the previous post this is handled. [How to make custom headers accessible for the client]().

```javascript
import { saveTokens } from "./manage-tokens";

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
   // you done this part
  }
});
```

### Access authorised GraphQL endpoint

You should now be able to run your `LoggedIn` component which calls an authorised GraphQL endpoint and successfully get the user data.

```javascript
function LoggedIn(){
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