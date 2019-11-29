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

In the previous article I talked about [security concerns around storing tokens](/coding/send-jwt-client-apollo-graphql#securely-storing-jwt-tokens) in localStorage. I thought it would be worth exploring how to use `httpOnly` cookies when making requests from a React client-side app. This will include making changes to the [Apollo Graphql Server](/coding/json-web-tokens-using-apollo-graphql) to manage cookies from the client. In this post I will go through the changes need to enable storing <abbr title="JSON web token">JWT</abbr>s in **httpOnly** cookies from sending headers.

<!--more-->

- [Using HTTPOnly cookies for JWT GraphQL server](#using-httponly-cookies-for-jwt-graphql-server)
    - [Changes to the Apollo Graphql server](#changes-to-the-apollo-graphql-server)
    - [Changes to the React app](#changes-to-the-react-app)

### Changes to the Apollo Graphql server


### Changes to the React app

Instead of login and store tokens the Login mutation can return the user data

```javascript
// old
`mutation Login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    refreshToken
    accessToken
  }
}`

// change
`mutation Login($username: String!, $password: String!) {
  login(username: $username, password: $password) {
    id
    name
    username
  }
}`
```

It's useful to know if the user is logged in client-side and have quick access to public information in localStorage. I recommend replacing the token storage to store public user data.

```javascript
// CHANGES - replace token store with user data
const USER_KEY = "loggedInUser";
export function saveUser(tokens) {
  localStorage.setItem(USER_KEY, JSON.stringify(tokens));
}

export function getUser() {
  return JSON.parse(localStorage.getItem(USER_KEY));
}

export function deleteUser() {
  localStorage.removeItem(USER_KEY);
}
```


```javascript
// Changes to login form
// ...
function LoginForm() {
  // ...
  const [login, { data }] = useMutation(gql`
    mutation Login($username: String!, $password: String!) {
      login(username: $username, password: $password) {
        id
        name
        username
      }
    }
  `);

  async function submitLogin(e) {
    e.preventDefault();
    const { data } = await login({ variables: loginDetails });
    if (data && data.login) {
      saveUser(data.login);
    }
  }
  // ...
}
```

The most noticeable change will be where the `ApolloClient` is used. All of the **interceptor** code written for sending and receiving headers is removed. This is replaced with `credentials: "include"` which ensures the cookies are sent on each request. This is great as it does simplify the main app file making our developer lives that little bit easier.

```javascript
// Changes to ApolloClient
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "@apollo/react-hooks";
import { getTokens } from "./manage-tokens";

const client = new ApolloClient({
  uri: '/graphql',
  credentials: "include"
});
// ...
```

On any page request you can fetch the user information from the server which will also ensure the user is still authorised. However you will also have access to the user information in localStorage when you need it to display in the UI or build user related _GraphQL_ queries.

These are all the changes need to use _httpOnly_ cookies and hopefully this has helped you migrate from localStorage approach if you feel you needed it. 

If you have any feedback please write in the comments below or [tweet me](https://twitter.com/share?text=Send JWT tokens from client to GraphQL server @richardkotze &url=https://www.richardkotze.com/coding/send-jwt-client-apollo-graphql&hashtags=javascript,reactjs,graphql){:target="\_blank" rel="noopener"}.
