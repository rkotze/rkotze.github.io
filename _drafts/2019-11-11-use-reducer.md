---
layout: post
title: "Manage complex state with React useReducer and useContext"
date: 2019-11-07 06:00:12 +0000
permalink: /coding/react-hooks-usereducer-context
category: coding
full_image_url: https://user-images.githubusercontent.com/10452163/67992561-2a05cc00-fc35-11e9-916d-c7fbf8c1dc78.jpg
meta_description: >
  Manage complex state with React Hooks for a feature which has many nested child components. Combining useReducer and useContext.
excerpt_separator: <!--more-->
---

This post will cover managing complex state at a feature level rather than the entire site. [**React hooks**](https://reactjs.org/docs/hooks-intro.html){:target="\_blank" rel="noopener"} have enabled us to have cleaner functional components which enable us to rationalise our component logic with easy.

Take `useState` hook, it's one line of code which then can be used to manage the state of a component rather than having to create a `class` that comes with boiler code. This is great because we are keeping simple things simple!

However, there are features which are inherently complex as they have many nested child components which need to alter the state of the component.

**What options** are there to manage this complexity in _React_?

<!--more-->

Generally is good practice to **keep it simple**, which might lead you down the path of passing the `setState` function down the stack of components. The downside here is the mutation of state can become difficult to follow, for example four actions can affect the state in different ways making it unclear what shape the state object looks like. You could end up with many independent copies of the same data. 

It is also worth considering how easy is it to test changes to state. Unit testing changes to state through rendering components can be tricky and takes extra time to build compared to pure functions.

Ideally you want to make it **easy** to follow changes to the component state and create unit tests which give confidence in the functionality working.

To help **explain** the idea I've created a classic _Todo_ app in CodeSandbox.io.

Since the release of [_React 16.8_](https://github.com/facebook/react/blob/master/CHANGELOG.md#1680-february-6-2019){:target="\_blank" rel="noopener"} hooks were introduced. A hook which is helpful for managing more complex state is [_useReducer_](https://reactjs.org/docs/hooks-reference.html#usereducer){:target="\_blank" rel="noopener"} and as the docs say it's an alternative to _useState_. This essentially borrows the good concepts from [Redux](https://redux.js.org/faq/react-redux){:target="\_blank" rel="noopener"} but with less complex setup and boiler code to work with React. 

```javascript
const [todoList, dispatch] = useReducer(toDoReducer, initialState);
```

We can also use _React Context_. The benefit of combining `useReducer` with context is being able to call the `dispatch` function anywhere down the component tree without passing through props.

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

To access the context in child components the `useContext` hook is needed.

```javascript
const dispatch = useContext(TodosDispatch);
```

This idea is recommended in the React docs, [avoid passing callback down](https://reactjs.org/docs/hooks-faq.html#how-to-avoid-passing-callbacks-down){:target="\_blank" rel="noopener"}

### Example using useReducer and React context

#### **Key points** demoed in the codesandbox

- Key functions:
  - `TodosContext` is where the reducer `dispatch` function will be stored
  - `toDoReducer` transforms the task list state based on actions e.g. add task
  - `initialState` contains one task object in an Array
  - `addAction`, `markAction`, `deleteAction` are all action creators which describe how to change the state
- Key components:
  - `App` calls `useReducer` and passes the `dispatch` function into `TodosDispatch.Provider`
  - `InputTask` user can enter task name and calls the `addAction` on submit
  - `TaskList` reads the `todoList` state and renders a numbered task list
  - `Action` is a generic button component which has access to `dispatch` to trigger add, done, undo and delete actions.

Explore the codesandbox below to see how it's all connected

<iframe
     src="https://codesandbox.io/embed/todo-reducer-and-context-mz1mo?autoresize=1&fontsize=14"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="todo-reducer-and-context"
     allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
     sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
   ></iframe>

Hope this help you tackle how to manage state in your next React feature you build.

If you like this post please [share on Twitter](https://twitter.com/share?text=Manage complex state with React useReducer and useContext @richardkotze &url=https://www.richardkotze.com/coding/react-hooks-usereducer-context&hashtags=javascript,reactjs){:target="\_blank" rel="noopener"}.


