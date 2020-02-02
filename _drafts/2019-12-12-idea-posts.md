---
layout: post
title: "Idea/Draft posts"
date: 2020-01-28 06:00:12 +0000
permalink: /ideas
category: coding
excerpt_separator: <!--more-->
---

See all the ideas.

<!--more-->

# Why and how to use React Context 

Now that React context has become more established in the community we are seeing a lot of great examples. Reflecting on a previous post about Higher-order components (HOC) vs Render props, I rarely use HOC and generally deciding between Context or Render props. How do you decide which to use?

## Brief overview of React Context

The React docs have an in-depth post covering all aspects of [React Context](https://reactjs.org/docs/context.html){:target="\_blank" rel="noopener"}, but I will provide a summary of it and how to use it.

What is the purpose of React Context?

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

Areas you might use React Context

- Site settings/preferences 
- Themes, make it easy to change switch between light/dark theme
- Logged in user details, hide/show user views depending if they are logged in
- E-commerce basket management, showing items added to a basket when searching and adding items 

The above are typically global to the application however, it does not mean context should be used only for global features. It can be used further down the component tree to manage state of a complex feature. For example multiple step form and depending on answers determines the next question to show.

It does sound like React Context can be used for anything, however there are other options for cross cutting concerns which maybe preferred. It would be excessive for handling local state with a component tree of two or three levels. For the same principle of keeping code easy to reason about here are other options. To handle state for a basic form you can use the [Render props](/coding/understanding-render-props-react-js) approach, like the popular form library [Formik](https://github.com/jaredpalmer/formik){:target="\_blank" rel="noopener"}. When two components share the same state you can use [lifting state up](https://reactjs.org/docs/lifting-state-up.html){:target="\_blank" rel="noopener"} as an option.

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

Compare Render props

# Universal React starter project

# Some web apis you may not have heard of?

MutationObserver https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver

Performance https://developer.mozilla.org/en-US/docs/Web/API/Performance 

Visibility API https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API https://stackoverflow.com/questions/1760250/how-to-tell-if-browser-tab-is-active

# Web workers

# Quirks of modern javascript

# Dockerise create react app run on windows

# How to make a chrome extension 

# Graphql server validation errors

Make it part of the mutation payload object.

# Consistent complexity scoring

In your team you are flexible on pair programming and generally decide that we will pair if someone needs help or the work is complex. This causes an issue with items piling up in review because the easy items move quickly to review and the engineer decides to start a new work, but they take on another easy task that skips over to review fairly soon while the other pair on a complex issue. When the complex task moves over to review finally the pair is free to review the small items.

The pair working on the complex issue could review items immediately but this comes at the cost of losing your line of thought to solving the issue they were working on. It will become frustrating if more things move to review quickly.

If there is feedback for code changes then the engineer starting a new task needs to address those, this means one item in the flow is not being worked on. Typically things nearest to done are of higher priority, so best to stop what is in progress but this will mean another costly context switch as well.

Then the person soloing goes on annual leave with work in progress and the other team members are not sure where they left off.

How can we mitigate these issues?

- Be strict on pairing, so pair on the simple tasks.
- Limit the WIP to the number of pairs you have for the day.
- I recommend that each work item is similar in complexing to each other. This should help with getting items into review in a similar time frame.

* You could agree that pairing on simple tasks means it could skip review.

* Opinion on the value of limiting WIP to the number of pairs you have
* The danger of having doing simple tasks solo
* The challenge of reviewing code #honest

# Azure pipeline thoughts

### Why have a delivery pipeline?

Generally a delivery pipeline gives you confidence that your app is functioning as you expect it and preventing regression. Including a delivery step will help reduce the over head of remembering the commands to run to release into production. However, there is a lot more about the importance of having a pipeline, you can read more from my post on [CI and continuous delivery (CD)](/continuous-integration-delivery-deployment)

### What I like Azure pipeline

As far as Azure pipelines are concerned I thought it would be worth trying to see how well it worked and the benefits of using it.

- It's free and you get a lot of good features for the free tier
- You can provide a configured yaml file which manages a good variety of steps. This allows you to version control your pipeline, which is always handy.
- The pipeline UI is clean and simple to navigate
- You can construct the pipeline in the UI with a load of predefined tasks then copy the yaml out to your project.
- I found the pipeline configuration really flexible which in a way is good/bad
- Lots of documentation about specific features and a few get started tutorials which I found handy.
