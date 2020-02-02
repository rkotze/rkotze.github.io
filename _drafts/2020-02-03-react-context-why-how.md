---
layout: post
title: "Why and how to use React Context "
date: 2020-01-20 06:00:12 +0000
permalink: /projects/why-how-use-react-context
category: projects
published: true
full_image_url: "https://user-images.githubusercontent.com/10452163/58038723-ae054500-7b28-11e9-8799-2d7b5b9a72b1.png"
meta_description: >
  Why and how to use React context
excerpt_separator: <!--more-->
tags: javascript react
---

Now that React context has become more established in the community we are seeing a lot of great examples. Reflecting on a previous post about Higher-order components (HOC) vs Render props, I rarely use HOC and generally deciding between Context or Render props. With the introduction of hooks and in particular `useContext`, React context is more accessible and has become a go to approach to solving complex state management. However, there are options to handle these cross cutting concerns and so we should be clear on why we are using context. Let's explore why and how to use React context. 

<!--more-->

![Lancedarkly toggle view](https://user-images.githubusercontent.com/10452163/58038723-ae054500-7b28-11e9-8799-2d7b5b9a72b1.png)
_LanceDarkly toggle view in VS Code_

## Why React context

The React docs have an in-depth post covering all aspects of [React context](https://reactjs.org/docs/context.html){:target="\_blank" rel="noopener"}, but I will provide a summary of it and how to use it.

What is the purpose of React context?

> Context provides a way to pass data through the component tree without having to pass props down manually at every level.

For example you might have a container component responsible for fetching user data that is consumed by several components further down the component tree. If you were building a profile page to show an avatar there might be a navbar component containing a dropdown component which has an image element for the avatar. Further down the page there is a profile wrapper and inside that a header component to render the avatar. The intermediate components don't use the data, `NavBar`, `Dropdown` and `ProfileWrapper`, only pass the data along.

Passing data is a poor approach because:

- Exposing data to components that don't need to know about it
- It's repetitive code and makes the component api more verbose
- Difficult and frustrating developer experience to follow where the data comes from, especially in a large component tree

Context removes these issues as you can:

- Explicitly decide which components have access to that data
- Less repetitive
- Using context makes it clear where the data comes from

Ultimately context can make complex code easier to rationalise.

Areas you might use React context

- Site settings/preferences 
- Themes, make it easy to change switch between light/dark theme
- Logged in user details, hide/show user views depending if they are logged in
- E-commerce basket management, showing items added to a basket when searching and adding items 

The above are typically global to the application however, it does not mean context should be used only for global features. It can be used further down the component tree to manage state of a complex feature. For example multiple step form and depending on answers determines the next question to show.

It does sound like React context can be used for anything, however there are other options for cross cutting concerns which maybe preferred. It would be excessive for handling local state with a component tree of two or three levels. For the same principle of keeping code easy to reason about here are other options. To handle state for a basic form you can use the [Render props](/coding/understanding-render-props-react-js) approach, like the popular form library [Formik](https://github.com/jaredpalmer/formik){:target="\_blank" rel="noopener"}. When two components share the same state you can use [lifting state up](https://reactjs.org/docs/lifting-state-up.html){:target="\_blank" rel="noopener"} as an option.

## How to use it?

I wrote a post a while back covering [manage complex state with React useReducer and useContext](/coding/react-hooks-usereducer-usecontext). This is where I first mention it and it comes with a **todo list coding example** on Code Sandbox. I've decided to fork that sandbox and refactor it to have a better _todo API_ in React context.

React context is made of two parts a **Provider** and a **Consumer**. The provider is where the **values** are defined that the consumer can access. Following the good practice of _encapsulation_ we won't expose the actual React provider but a wrapping component which will define the values. This simplifies the usage of `ToDoContext` and expose parts of the API to be used. Below is a code example show this:

```jsx
// todo-context.js
const TodosContext = React.createContext();

export function TodoProvider({ children }) {
  const [todoList, dispatch] = useReducer(toDoReducer, initialState);
  return (
    <TodosContext.Provider value={{ todoList, dispatch }}>
      {children}
    </TodosContext.Provider>
  );
}
```


The downside of LaunchDarkly is it's not a free tool but it does have a free trial if you want to give it a go. If you have ideas or feedback for my LanceDarkly extension then please [tweet it](https://twitter.com/share?text=LanceDarkly: manage feature toggles in VS Code by @richardkotze &url=https://www.richardkotze.com/projects/lancedarkly-manage-feature-toggles-vs-code&hashtags=javascript,programming,coding){:target="\_blank" rel="noopener"}.
