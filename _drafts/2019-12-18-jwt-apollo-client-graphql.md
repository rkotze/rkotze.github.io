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

These are the steps needed for your web app to handle authentication with the server

1. [Login and store tokens]()
1. [Send tokens on each request]()
1. [Update client with new tokens]()

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

### Update client with new tokens
