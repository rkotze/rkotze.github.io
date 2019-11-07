---
layout: post
title: "Complex state managed with React hook useReducer"
date: 2019-11-07 06:00:12 +0000
permalink: /coding/react-hooks-usereducer-context
category: coding
full_image_url: https://user-images.githubusercontent.com/10452163/67992561-2a05cc00-fc35-11e9-916d-c7fbf8c1dc78.jpg
meta_description: >
  Manage complex state in React for a feature which has many nested child components.
excerpt_separator: <!--more-->
---

This post will cover managing complex state at a feature level rather than the entire site. [**React hooks**](https://reactjs.org/docs/hooks-intro.html){:target="\_blank" rel="noopener"} have enabled us to have cleaner functional components which enable us to rationalise our component logic with easy.

Take `useState` hook, it's one line of code which then can be used to manage the state of a component rather than having to create a `class` that comes with boiler code. This is great because we are keeping simple things simple!

However, there are features which are inherently complex as they have many nested child components which need to alter the state of the component.

**What options** are there to manage this complexity in _React_?

<!--more-->

Generally is good practice to **keep it simple**, which might lead you down the path of passing the `setState` function down the stack of components. The downside here is the mutation of state can become difficult to follow, for example four actions can affect the state in different ways. It is also worth considering how easy is it to test changes to state. Unit testing changes to state through rendering components can be tricky and takes extra time to build compared to more pure functions.

Ideally you want to make it **easy** to follow changes to the component state and create unit tests which give confidence.

Since the release of [_React 16.8_](https://github.com/facebook/react/blob/master/CHANGELOG.md#1680-february-6-2019){:target="\_blank" rel="noopener"} hooks were introduced. A hook which is helpful for managing more complex state is [_useReducer_](https://reactjs.org/docs/hooks-reference.html#usereducer){:target="\_blank" rel="noopener"} and as the docs say is an alternative to _useState_. This essentially borrows some of the good concepts from [Redux](https://redux.js.org/faq/react-redux){:target="\_blank" rel="noopener"} but with less complex setup and boiler code to work with React. 

```javascript
const [state, dispatch] = useReducer(reducer, initialState);
```

To prevent the need to pass the callback `dispatch` down the stack of components we can use `createContext`. The benefit of combining `useReducer` with context is you can call the `dispatch` function anywhere in the component tree without passing it down. This idea is recommended in the React docs, [avoid passing callback down](https://reactjs.org/docs/hooks-faq.html#how-to-avoid-passing-callbacks-down){:target="\_blank" rel="noopener"}

```jsx
const TodosDispatch = React.createContext(null);

function App() {
  const [todo, dispatch] = useReducer(toDoReducer, initialState);
  return (
    <TodosDispatch.Provider value={dispatch}>
     ...ToDoApp
    </TodosDispatch.Provider>
  );
}
```

To help convey the idea I've created a classic _Todo_ app in CodeSandbox.io.

<iframe
     src="https://codesandbox.io/embed/todo-reducer-and-context-mz1mo?autoresize=1&fontsize=14"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="todo-reducer-and-context"
     allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
     sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
   ></iframe>

Explain app
