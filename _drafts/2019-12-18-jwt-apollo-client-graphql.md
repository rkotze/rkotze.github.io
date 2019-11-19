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
1. []()
