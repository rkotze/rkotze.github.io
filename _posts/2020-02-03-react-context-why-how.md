---
layout: post
title: "Why and how to use React context"
date: 2020-02-03 06:00:12 +0000
permalink: /coding/why-how-use-react-context
category: coding
published: true
full_image_url: "https://user-images.githubusercontent.com/10452163/73617558-f1043b80-4617-11ea-8b40-d8ed375c6c45.jpg"
meta_description: >
  Why and how to use React context with detailed code examples
excerpt_separator: <!--more-->
tags: javascript react tutorial
---

Now that React context has become more established in the community we are seeing a lot of great usages of it. Reflecting on a previous post about [Higher-order components (HOC) vs Render props](/coding/hoc-vs-render-props-react), I rarely use HOC and now generally choose between Context or Render props. With the introduction of hooks and in particular `useContext` hook, React context is more accessible and has become a go-to approach to solving complex state management. However, there are other options to handle these cross-cutting concerns and so we should be clear on why we are using context. Let's explore why and how to use React context. 

<!--more-->

![Side view of steps in all white](https://user-images.githubusercontent.com/10452163/73617558-f1043b80-4617-11ea-8b40-d8ed375c6c45.jpg)
_Photo by Stéphane Mingot on Unsplash_

## Why React context

The React docs have an in-depth post covering all aspects of [React context](https://reactjs.org/docs/context.html){:target="\_blank" rel="noopener"}, but here I will provide a summary of it and how to use it.

What is the purpose of React context?

> Context provides a way to pass data through the component tree without having to pass props down manually at every level.

For example, you might have a container component responsible for fetching user data that is consumed by several components further down the component tree. If you were building a profile page to show an avatar, there might be a navbar containing a dropdown which has an image element for the avatar. Further down the page, there is a profile wrapper and inside that a header component to render the avatar. The intermediate components don't use the data, `NavBar`, `Dropdown` and `ProfileWrapper`, only pass the data along.

### Passing data via props is a poor approach because:

- Exposing data to components that don't need to know about it
- It's repetitive code and makes the component props more verbose
- Difficult and frustrating developer experience to follow the flow of data, especially in a large and complex component tree

### React context removes these issues by:

- Explicitly declaring the use of context and therefore handling which components have access to that data
- Less repetitive and not polluting the component props
- Using context makes it clear where the data is defined

Using context to manage data flow in a complex component tree can help make code easier to rationalise.

### Areas you might use React context

- Site settings/preferences for a user
- Styling themes, eg, making it easy to change switch between light/dark theme
- User details, hide/show user views depending on if they are logged in
- E-commerce basket management, showing items added to a basket when searching and adding items 

The above examples could be regarded as **global** to an application. However, it does not mean context should be used only for global features. It can be used further down the component tree to manage the state of a complex feature. For example, a multi-step form where next questions are dependent on previous answers.

### More options 

It does sound like React context can be used for anything, however there are other options for cross-cutting concerns which may be preferred. Context would be excessive for handling local state with a component tree of two or three levels. With the principle of keeping code easy to reason about here are other approaches:

* To handle state for a basic form you can use the [Render props](/coding/understanding-render-props-react-js) approach, like the popular form library [Formik](https://github.com/jaredpalmer/formik){:target="\_blank" rel="noopener"}. 
* When two components share the same state you can use [lifting state up](https://reactjs.org/docs/lifting-state-up.html){:target="\_blank" rel="noopener"} as an option.

## How to use it?

I wrote a post in November covering [manage complex state with React useReducer and useContext](/coding/react-hooks-usereducer-usecontext). This is where I first mention Context and it comes with a **todo app coding example** on CodeSandbox. I've decided to fork that sandbox and refactor it to have a better _todo API_ in React context.

### Let's begin

React context is made of two parts a **Provider** and a **Consumer**. The provider is where the **values** are defined that the consumer can access. Following the good practice of _encapsulation_ we won't expose the actual React provider but a wrapping component which will define the values. This simplifies the usage of `ToDosContext` and exposes essential parts of the API to be used. Below is a code example which exhibits this:

```jsx
// todo-context.js
const TodosContext = React.createContext();

export function TodoProvider({ children }) {
  const [todoList, dispatch] = useReducer(toDoReducer, initialState);
  return (
    <TodosContext.Provider value={ { todoList, dispatch } }>
      {children}
    </TodosContext.Provider>
  );
}
```

Following the same method of abstraction let's not expose the `dispatch` function but instead provide the methods to manage the tasks, `add`, `remove` and `mark`:

```jsx
// todo-context.js
// ...
export function TodoProvider({ children }) {
  const [todoList, dispatch] = useReducer(toDoReducer, initialState);
  const actions = {
    add(text) {
      dispatch(addAction(text));
    },
    mark(taskId, done) {
      dispatch(markAction(taskId, done));
    },
    remove(taskId) {
      dispatch(deleteAction(taskId));
    }
  };
  return (
    <TodosContext.Provider value={ { todoList, actions } }>
      {children}
    </TodosContext.Provider>
  );
}
```

From `todo-context.js` we can also export the **consumer** like so:

```javascript
export const TodosConsumer = TodosContext.Consumer;
```

Also export the main `TodosContext` on default:

```javascript
export default TodosContext;
```

Let's look at how to access and use the `add` action in the todo context. One option is to use the React hook `useContext`. This hook takes the `ToDosContext` and can access the actions, which are then destructed out. The `add` action is called in the `handleSubmit` function to add a new task. See snippet below:

```javascript
// input-task.js
// InputTask ...
const [task, setTask] = useState("");
const {
  actions: { add }
} = useContext(TodosContext);

function handleSubmit(e) {
  e.preventDefault();
  add(task);
  setTask("");
}
// ...
```

Another way to access the context is to use the consumer component. In the `TaskList` component below the `TodosConsumer` reads the `todoList` array. This uses the [Render props pattern](/coding/understanding-render-props-react-js) to access the context via the `children` prop as a callback function:

```jsx
// task-list.js
export function TaskList() {
  return (
    <TodosConsumer>
      {({ todoList }) => (
        <ol className="task-list">
          {todoList.map((task, i) => {
            return (
              <li className="task-item" key={i}>
               {/* ... */}
              </li>
            );
          })}
        </ol>
      )}
    </TodosConsumer>
  );
}
```

Another option to control access to the consumer is to create a custom React hook using `useContext`, wrap some error logic like 'expect todo provider to be present'. See code example below:

```javascript
export function useToDo(){
  const context = React.useContext(TodosContext);
  if (context === undefined) {
    throw new Error('useToDo must be used within a TodoProvider')
  }

  return context
}
```

Explore my CodeSandbox further, [Refactor ToDo app useReducer and React Context](https://codesandbox.io/s/react-todo-reducer-and-context-refactor-wuk9g?fontsize=14&hidenavigation=1&theme=dark){:target="\_blank" rel="noopener"}

I hope this helps you use React context more effectively in your day to day coding. Comment on [Twitter](https://twitter.com/share?text=Why and how to use React context by @richardkotze &url=https://www.richardkotze.com/coding/why-how-use-react-context&hashtags=javascript,reactjs,coding){:target="\_blank" rel="noopener"} or below.
