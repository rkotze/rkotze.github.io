---
layout: post
title: "Manage complex state with React useReducer and useContext"
date: 2019-11-11 06:00:12 +0000
permalink: /coding/react-hooks-usereducer-usecontext
category: coding
full_image_url: https://user-images.githubusercontent.com/10452163/68551611-a43d0a00-0406-11ea-963e-6f501b6a13ae.jpg
meta_description: >
  Manage complex state with React Hooks for a feature which has many nested child components. Combining useReducer and useContext.
excerpt_separator: <!--more-->
tags: javascript react tutorial
---

This post will cover managing complex state at a feature level rather than the entire site. [**React hooks**](https://reactjs.org/docs/hooks-intro.html){:target="\_blank" rel="noopener"} have enabled developers to have cleaner functional components which help to rationalise our component logic with ease.

Take `useState` hook, it's one line of code that can be used to manage the state of a component rather than having to create a `class` component with the addition of boiler code. This is great because we are keeping simple things clear!

However, there are features that are inherently complex as they could have many nested child components and need to alter the state.

**What options** are there to manage this complexity in _React_?

<!--more-->

![Person holding plasma ball](https://user-images.githubusercontent.com/10452163/68551611-a43d0a00-0406-11ea-963e-6f501b6a13ae.jpg)
_Photo by Ramón Salinero on Unsplash_

Generally is good practice to **keep it simple**, which might lead you down the path of passing the `setState` callback down the stack of components. The downside here is the mutation of state can become difficult to follow. Allowing child components to alter the state directly will make it unclear what the state object should look like. By not having a single source of truth where the mutation is managed then the result could be unexpected and requires an overhead to work out. 

It is also worth considering how easy is it to _test_ changes to state. Unit testing state through rendering components can be tricky and takes more time to build compared to pure functions.

Ideally you want to make it **easy** to follow changes to the component state and create unit tests which give confidence that the functionality works.

To help **explain** the idea I've created a classic _Todo_ app in CodeSandbox.io.

[_React 16.8_](https://github.com/facebook/react/blob/master/CHANGELOG.md#1680-february-6-2019){:target="\_blank" rel="noopener"} introduced hooks. A hook which is helpful for managing complex state is [_useReducer_](https://reactjs.org/docs/hooks-reference.html#usereducer){:target="\_blank" rel="noopener"}, and as the docs say it's an alternative to _useState_. This essentially borrows the good concepts from [Redux](https://redux.js.org/faq/react-redux){:target="\_blank" rel="noopener"} but with less complex setup and boiler code to work with React. 

```javascript
const [todoList, dispatch] = useReducer(toDoReducer, initialState);
```

We can also use _React Context_. The benefit of combining `useReducer` with context is being able to call the `dispatch` function anywhere down the component tree without passing through props. Preventing the need to follow it through the component tree to find the callback.

```jsx
const TodosDispatch = React.createContext(null);

function App() {
  const [todoList, dispatch] = useReducer(toDoReducer, initialState);
  return (
    <TodosDispatch.Provider value={dispatch}>
     ...ToDoApp
    </TodosDispatch.Provider>
  );
}
```

To access the context in child components the React hook `useContext` can be used.

```javascript
const dispatch = useContext(TodosDispatch);
```

This idea is recommended in the React docs, [avoid passing callback down](https://reactjs.org/docs/hooks-faq.html#how-to-avoid-passing-callbacks-down){:target="\_blank" rel="noopener"}

### Example React todo app with useReducer and useContext

#### **Key points** demoed in the CodeSandbox

You can see how clean and simple the _unit tests_ are for the reducer in the `todo.spec.js` file. This will give confidence that the logic works as expected when state changes. These unit tests help manage complexity, preventing regression when the reducer is updated to handle a new action.

- Key functions:
  - `TodosContext` is where the reducer `dispatch` callback will be stored
  - `toDoReducer` transforms the task list state based on actions e.g. add task
  - `initialState` contains one task object in an Array
  - `addAction`, `markAction`, `deleteAction` are all action creators which describe how to change the state
- Key components:
  - `App` calls `useReducer` and passes the `dispatch` function into `TodosDispatch.Provider`
  - `InputTask` user can enter task name and calls the `addAction` on submit
  - `TaskList` reads the `todoList` state and renders a numbered task list
  - `Action` is a generic button component which has access to `dispatch` to trigger done, undo and delete actions.

Explore the CodeSandbox [useReducer and useContext React todo app](https://codesandbox.io/s/react-todo-reducer-and-context-mz1mo){:target="\_blank" rel="noopener"} below to see how it's all connected. 

See my new post refactoring the above CodeSandbox [why and how to use React context](/coding/why-how-use-react-context).

Hope this helps you tackle managing state in the next React feature you build.

If you like this post please [share on Twitter](https://twitter.com/share?text=Manage complex state with React useReducer and useContext @richardkotze &url=https://www.richardkotze.com/coding/react-hooks-usereducer-context&hashtags=javascript,reactjs){:target="\_blank" rel="noopener"}.
