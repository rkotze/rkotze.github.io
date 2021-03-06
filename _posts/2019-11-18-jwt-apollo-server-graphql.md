---
layout: post
title: "JWT tokens for authentication using Apollo GraphQL server"
date: 2019-11-18 06:00:12 +0000
permalink: /coding/json-web-tokens-using-apollo-graphql
category: coding
full_image_url: https://user-images.githubusercontent.com/10452163/68999707-54ee5200-08bc-11ea-90dd-4509735e0b22.jpg
meta_description: >
  How to build JWT tokens into a GraphQL server for authentication
excerpt_separator: <!--more-->
tags: javascript node graphql tutorial
---

This will be **part one** of two posts looking at using [JSON Web Tokens](https://jwt.io/){:target="\_blank" rel="noopener"} (JWT) for authentication and authorisation. I'll be integrating tokens into NodeJS Express and Apollo GraphQL server.

It will help if you are familiar with [Express](https://expressjs.com/){:target="\_blank" rel="noopener"} and [Apollo GraphQL](https://www.apollographql.com/){:target="\_blank" rel="noopener"} to fully benefit from this post, but reading this will give you a good idea of how to use JWT for authentication in Node applications.

First, let's cover the basic flow of JWT authentication when a request is made.

<!--more-->

![River between mountains](https://user-images.githubusercontent.com/10452163/68999707-54ee5200-08bc-11ea-90dd-4509735e0b22.jpg)
_Photo by Lustig Photography on Unsplash_

Below is the flow of actions for when a request arrives at the server and is intercepted with our custom authentication middleware:

1. If access token exists carry on, else skip authentication check
1. Validate access token, append user data to request object and continue, else fall back to refresh token
1. Validate refresh token by checking the user is in the database, generate new tokens, append user data to request and continue with the request
1. Each GraphQL endpoint will determine what data to show based on the user data appended to the request
1. Endpoints requiring authentication with invalid tokens will throw an authentication error.

There are two tokens generated: `access-token` and `refresh-token`. The access token has a short expiry of 15 minutes and if still valid we send that request straight through to the resolver instead of querying our user table. The refresh token has a longer expiry of 7 days and at this point, we check the user is still valid in our database and that will generate new tokens for the session.

It's **important** to note that signed tokens can be decoded and the contents revealed, so **don't store sensitive data** inside. However, there are options to encrypt tokens but this is not covered in this tutorial. [Learn more about JWT.](https://jwt.io/introduction/){:target="\_blank" rel="noopener"}

## Getting started

I will be starting from a point where you have set up a Node server using Express and [Apollo Server](https://www.apollographql.com/docs/apollo-server/){:target="\_blank" rel="noopener"}. Part **two** of this tutorial, [send JWT tokens from client to GraphQL server](/coding/send-jwt-client-apollo-graphql)

Steps:

1. [Basic set up of Apollo Server](#basic-set-up-of-apollo-server)
1. [Login and sign tokens](#login-and-sign-tokens)
1. [Express middleware to validate tokens](#express-middleware-to-validate-tokens)
1. [Access endpoint with valid tokens](#access-endpoint-with-valid-tokens)

### Basic set up of Apollo Server

Here is a list of npm packages to install:

```bash
npm i apollo-server-express jsonwebtoken express graphql
```

In your main entry file include the code below. The important part is adding the request and response objects to the `ApolloServer` context. This will allow access to the request object in the resolvers that contain user information decoded from a token.

```javascript
const { ApolloServer } = require("apollo-server-express");
...
const apolloServer = new ApolloServer({
  schema,
  context: ({ req, res }) => ({ req, res })
});
```

The following code should be directly after the above, and you can see the Express `app` is passed into the `apolloServer.applyMiddleware`.

```javascript
const app = express();
app.use(validateTokensMiddleware); // middleware to be built
apolloServer.applyMiddleware({ app });
app.listen({ port: process.env.PORT }, () =>
  console.log(
    `🚀 Server ready at http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`
  )
);
```

This basic set up of the Apollo Server will give you access to [GraphQL Playground](https://www.apollographql.com/docs/apollo-server/testing/graphql-playground/){:target="\_blank" rel="noopener"} to test out the schema and run queries. You'll find it under `localhost:<port>/graphql`.

### Login and sign tokens

First, we need to generate valid tokens for the client to send when making requests to authorised endpoints. Let's create a login GraphQL **mutation**.

**Type definition**

```javascript
const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Tokens {
    accessToken: String
    refreshToken: String
  }

  type Mutation {
    login(username: String, password: String!): Tokens
  }
`;
```

**Resolver** will get the user information from a data source, validate user credentials and return an object containing an access token and refresh token.

```javascript
async function login(_, { username, password }) {
  const user = await users.get({ email, username });
  if (!user) return null;

  const passwordValid = await validatePassword(password, user.password);

  if (!passwordValid) return null;

  return setTokens(user);
}
```

Taking the valid user details we will **sign** these details to generate our tokens. This is using the [`jsonwebtoken`](https://www.npmjs.com/package/jsonwebtoken){:target="\_blank" rel="noopener"} package which has a sign method.

The **access token** is set a short 15-minute expiry date to handle a regular succession of querying without needing to check against our data source each time.

The **refresh token** is set a longer expiry date of 7 days and when using this token the user details are checked against the data source. Another difference is we store a `count` value that is used to invalidate the user token by incrementing it and forcing the user to log in again.

Both tokens should use **different secret keys** to generate them and remember **not** to hard code secret information and commit to source control.

```javascript
// module `set-tokens`
const { sign } = require("jsonwebtoken");

function setTokens(user) {
  const sevenDays = 60 * 60 * 24 * 7 * 1000;
  const fifteenMins = 60 * 15 * 1000;
  const accessUser = {
    id: user.id
  };
  const accessToken = sign(
    { user: accessUser },
    "<your secret key for access token>",
    {
      expiresIn: fifteenMins
    }
  );
  const refreshUser = {
    id: user.id,
    count: user.tokenCount
  };
  const refreshToken = sign(
    { user: refreshUser },
    "<your secret key for refresh token>",
    {
      expiresIn: sevenDays
    }
  );

  return { accessToken, refreshToken };
}
```

### Express middleware to validate tokens

First, let's look at validating the tokens and returns the decoded contents. When using the `verify` method from the `jsonwebtoken` package it returns the decoded user object we signed earlier. If the token is invalid then it throws an error, which is why it's wrapped in a `try` `catch` block.

If either the access or refresh token fails `null` is returned to indicate the token is invalid.

```javascript
// module `validate-tokens`
const { verify } = require("jsonwebtoken");

function validateAccessToken(token) {
  try {
    return verify(token, "<your secret key for access token>");
  } catch {
    return null;
  }
}

function validateRefreshToken(token) {
  try {
    return verify(token, "<your secret key for refresh token>");
  } catch {
    return null;
  }
}
```

Using the `validateTokens` function in the express middleware we can validate the tokens. The middleware will be called for every request to your server and for each request we will require the client to attach two headers `x-access-token` and `x-refresh-token` to access authorised endpoints.

To tell the difference between the **decoded** tokens, the code below looks for the `decodedToken.user.count` property to be defined indicating it is the refresh token. The important thing with the refresh is to check the count in the token matches what is returned from the user data source token count. If it does not match then we don't regenerate the tokens.

### Enable client to read custom headers

When the tokens are refreshed the data is sent back on the response object with the same header keys. To enable the client to read those headers the `Access-Control-Expose-Headers` needs to be set with the `keys` you want to expose.

Generating new tokens means we don't need to keep hitting our database to authenticate the user and we essentially trust the user is who they say they are for the session time of 15 minutes.

```javascript
// module `validate-tokens-middleware`
const {
  validateAccessToken,
  validateRefreshToken
} = require("./validate-tokens");
const userRepo = require("../users/users-repository");
const { setTokens } = require("./set-tokens");

async function validateTokensMiddleware(req, res, next) {
  const refreshToken = req.headers["x-refresh-token"];
  const accessToken = req.headers["x-access-token"];
  if (!accessToken && !refreshToken) return next();

  const decodedAccessToken = validateAccessToken(accessToken);
  if (decodedAccessToken && decodedAccessToken.user) {
    req.user = decodedAccessToken.user;
    return next();
  }

  const decodedRefreshToken = validateRefreshToken(refreshToken);
  if (decodedRefreshToken && decodedRefreshToken.user) {
    // valid refresh token
    const user = await userRepo.get({ userId: decodedRefreshToken.user.id });
    // valid user and user token not invalidated
    if (!user || user.tokenCount !== decodedRefreshToken.user.count)
      return next();
    req.user = decodedRefreshToken.user;
    // refresh the tokens
    const userTokens = setTokens(user);
    res.set({
      "Access-Control-Expose-Headers": "x-access-token,x-refresh-token",
      "x-access-token": userTokens.accessToken,
      "x-refresh-token": userTokens.refreshToken
    });
    return next();
  }
  next();
}
```

### Access endpoint with valid tokens

You have a GraphQL endpoint which returns the logged in user details. When the query is made, first get the request (`req`) object from the context which is the third parameter in resolvers functions. Check if the `req.user` object is **not** empty to make the database query for the user, otherwise throw `AuthenticationError` object.

```javascript
const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    loggedInUser: User
  }
`;
```

```javascript
const { AuthenticationError } = require("apollo-server-express");
// logged in user resolver
const isEmpty = require("lodash/isEmpty");
async function loggedInUser(_, __, { req }) {
  if (isEmpty(req.user)) throw new AuthenticationError("Must authenticate");
  const user = await users.get({ userId: req.user.id });
  return user;
}
```

You can test this out by making a query for the logged-in user via GraphQL Playground client. Make a query to login and access the tokens. Copy and paste the tokens and set the headers before making the request for a logged-in user.

This is the **end of part one** and you learned how to make an authenticated backend for front-end (BFF) using <abbr title="JSON Web Tokens">JWT</abbr>. Part **two** is here [send JWT tokens from client to GraphQL server](/coding/send-jwt-client-apollo-graphql).

Add any feedback in the comments below for improvements or found something difficult to follow and I will make the adjustments as soon as possible.
