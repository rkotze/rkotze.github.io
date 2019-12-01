---
layout: post
title: "Securely manage JWT tokens for React apps"
date: 2019-11-29 06:00:12 +0000
permalink: /coding/jwt-secure-client-react-graphql
category: coding
full_image_url: https://user-images.githubusercontent.com/10452163/69915611-ee833b00-1448-11ea-9e62-7afd5fb49431.jpg
meta_description: >
  Store JWT tokens securely in HTTPOnly cookies for a React App to communicate to Apollo GraphQL server
excerpt_separator: <!--more-->
tags: javascript react node graphql tutorial
---

In the previous article I talked about [security concerns around storing tokens](/coding/send-jwt-client-apollo-graphql#securely-storing-jwt-tokens) in localStorage. I thought it would be worth exploring how to use `httpOnly` cookies when making requests from a React client-side app. This will include making changes to the [Apollo Graphql Server](/coding/json-web-tokens-using-apollo-graphql) to manage cookies from the client. In this post I will go through the changes need to enable storing <abbr title="JSON web token">JWT</abbr>s in **httpOnly** cookies from sending headers.

<!--more-->

![Chain locked tricycle to post](https://user-images.githubusercontent.com/10452163/69915611-ee833b00-1448-11ea-9e62-7afd5fb49431.jpg)
_Photo by Florian Klauer on Unsplash_

<!-- omit in toc -->### Why change from localStorage to cookies?

From what I learned you do again some more security. **HttpOnly** cookies can't be accessed by the JavaScript and this would prevent a third party script for example accessing the user tokens in an <abbr title="Cross-site scripting">XSS</abbr> attack. Also setting the cookies to **secure** only, meaning they can only be sent on _https_ connections ensures that data can't be intercepted on communication to the server. The [**SameSite**](https://web.dev/samesite-cookies-explained/){:target="\_blank" rel="noopener"} attribute of a cookie can help mitigate <abbr title="Cross-Site Request Forgery">CSRF</abbr> attacks, which is [supported on most browsers](https://caniuse.com/#feat=same-site-cookie-attribute){:target="\_blank" rel="noopener"}. In the release of a future version of [Chrome 80 will remove SameSite=None cookies](https://www.chromestatus.com/feature/5633521622188032){:target="\_blank" rel="noopener"}.

Developer experience wise the code is simplified on the client-side by a lot. Testing GraphQL queries in _Apollo Playground_ are potentially easier because you won't need to manually add the token headers for each request. On the Apollo Server there are significant changes to the code to support cookies however it does seem less complex than managing headers overall.

- [Changes to the Apollo Graphql server](#changes-to-the-apollo-graphql-server)
- [Changes to the React app](#changes-to-the-react-app)

### Changes to the Apollo Graphql server

Below are the code snippet changes from this post [JWT tokens for authentication using Apollo GraphQL server](/coding/json-web-tokens-using-apollo-graphql)

You will need to install [cors](https://www.npmjs.com/package/cors){:target="\_blank" rel="noopener"} & [cookieParser](https://www.npmjs.com/package/cookie-parser){:target="\_blank" rel="noopener"} express middleware packages to install:

```
npm i cors cookie-parser
```

Starting with the main server file where `ApolloServer` is instantiated you will need to adjust the _cors_ and provide options to the cors middleware. After that you can add the cookieParser.

```javascript
const server = new ApolloServer({
  schema,
  context: ({ req, res }) => ({ req, res }),
  cors: false // <- ADD
});

const corsConfig = process.env.NODE_ENV !== 'production' ? 
  { 
    "origin": "http://localhost:3000" ,
    "credentials": true
  } : 
  { 
    "origin": "https://your-website.com",
    "credentials": true
  }

const app = express();
app.use(cors(corsConfig));
app.use(cookieParser());
app.use(validateTokensMiddleware);
server.applyMiddleware({ 
  app, 
  cors: false // <- ADD 
  });
```

In the login mutation you will want to replace the logic for returning tokens with creating cookies. I've also thought it would be hand to return the user data.

```javascript
async function login(_, { email, password }, { res }) {
  const user = await users.get({ email });
  if (!user.data) return null;

  const foundUser = user.data;

  if (!validatePassword(password, foundUser.password)) return null;

  const tokens = setTokens(foundUser);
  const cookies = tokenCookies(tokens);
  res.cookie(...cookies.access);
  res.cookie(...cookies.refresh);
  return user.data;
}

function tokenCookies({ accessToken, refreshToken }) {
  const cookieOptions = { httpOnly: true, 
    // secure: true, //for HTTPS only
    // domain: "your-website.com",
    // SameSite: lax
  };
  return {
    access: ["access", accessToken, cookieOptions],
    refresh: ["refresh", refreshToken, cookieOptions]
  };
}
```

Changes to the middleware for validating tokens for each request. The function will need to read the cookies sent on the request which can be accessed `req.cookies`. The main change is to the refresh token, if token in invalid then clear the cookies and when it is valid send updated tokens by updating the cookies. For me this seems less complicated than sending new headers on response.

```javascript
async function validateTokensMiddleware(req, res, next) {
  const refreshToken = req.cookies["refresh"];
  const accessToken = req.cookies["access"];

  // ... access token logic does NOT change

  const decodedRefreshToken = validateRefreshToken(refreshToken);
  if (decodedRefreshToken && decodedRefreshToken.user) {
    const user = await userRepo.get({ userId: decodedRefreshToken.user.id });
    if (!user.data || user.data.tokenCount !== decodedRefreshToken.user.count) {
      // remove cookies if token not valid
      res.clearCookie("access");
      res.clearCookie("refresh");
      return next();
    }

    const userTokens = setTokens(user.data);
    req.user = userTokens.user;
    // update the cookies with new tokens
    const cookies = tokenCookies(userTokens);
    res.cookie(...cookies.access);
    res.cookie(...cookies.refresh);
    return next();
  }
  next();
}
```

You will need a logout Graphql mutation to clear the cookies when the user wants to logout.

```javascript
async function logout(_, __, { res }) {
  res.clearCookie("access");
  res.clearCookie("refresh");
  return true;
}
```

### Changes to the React app

Below are the code snippet changes from this post [send JWT tokens from React app to GraphQL server](/coding/send-jwt-client-apollo-graphql).

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


<!-- omit in toc -->### Testing in Apollo playground

When testing in Apollo playground you will need to make a change to the settings to allow the cookies storing the tokens to be sent on each request. Click the gear or cog icon in the top right to access setting and look for the option `"request.credentials"` and the value must be set to `"include"`. Now you should be able to successfully make requests after you have run the **Login** mutation.

These are all the changes need to use _httpOnly_ cookies and hopefully this has helped you migrate from localStorage approach if you feel you needed it. 

If you have any feedback please write in the comments below or [tweet me](https://twitter.com/share?text=Securely manage JWT tokens for a React app @richardkotze &url=https://www.richardkotze.com/coding/jwt-secure-client-react-graphql&hashtags=javascript,reactjs,graphql,infoSec){:target="\_blank" rel="noopener"}.
