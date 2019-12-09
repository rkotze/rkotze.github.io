---
layout: post
title: "Mocking React hooks when unit testing using Jest"
date: 2019-12-09 06:00:12 +0000
permalink: /coding/mocking-react-hooks-unit-testing-jest
category: coding
published: true
image: "https://user-images.githubusercontent.com/10452163/70393368-f0b53e80-19e0-11ea-85fd-e7b415a4a31b.jpg"
meta_description: >
  Examples on mocking React hooks to unit test using Jest and react-testing-library
excerpt_separator: <!--more-->
tags: javascript react unit-testing
---

This won't be a deep dive into unit testing React components but I will present some options for mocking external services. This is seen as good practice at the unit test level, as we don't want these tests dependant on an external API which will slow the feedback down and make the test fragile. Mocking is typically used quite loosely and there are plenty of nuances when we throw _spies_ and _stubs_ in the mix. However, they do have a particular meaning and they are all placed under the generic term of [Test Double](https://martinfowler.com/bliki/TestDouble.html){:target="\_blank" rel="noopener"} as described by Martin Fowler.

<!--more-->

Essentially a mock is about replacing the actual implementation with a set of functions that enable you to assert how the subject under test was used. Using test libraries like [Jest](https://jestjs.io/docs/en/mock-functions){:target="\_blank" rel="noopener"} we get this functionality to use in our asserts. For example, was a method called and with the expected parameters? Jest has built a simple API for managing mocks and does not break out into a more generic Test Double library - which gets confusing quick.

![red-puzzle-piece](https://user-images.githubusercontent.com/10452163/70393368-f0b53e80-19e0-11ea-85fd-e7b415a4a31b.jpg)
_Photo by Ryoji Iwata on Unsplash_

The first thing we are going to look at is the fact that most React apps make an Http call to an external service. In this example we make an a call to [SWAPI](https://swapi.co/){:target="\_blank" rel="noopener"} to get the names of characters from Star Wars. What we want to test is when a specific character is selected we show details of that character.

### Getting started

You can go ahead and use [create react app](https://github.com/facebook/create-react-app){:target="\_blank" rel="noopener"} which comes with [react-testing-library](https://github.com/testing-library/react-testing-library){:target="\_blank" rel="noopener"} installed, which I've posted about to help you get started [react-testing-library & Jest](/coding/react-testing-library-jest).

```
npx create-react-app your-app-name
```

**First we write a test** which checks that our fetch [React hook](https://reactjs.org/docs/hooks-intro.html){:target="\_blank" rel="noopener"} is called with "people" as the first parameter and returns fake data to be rendered into a select list. The test also asserts there are three items and one contains Luke Skywalker. Here is my GitHub repository containing these code examples, [Star Wars React app tests](https://github.com/rkotze/starwars-react-app-tests){:target="\_blank" rel="noopener"}.

```javascript
// list-character.spec.js
import React from "react";
import { render } from "@testing-library/react";

import { ListCharacters } from "./list-characters";
import { useTheFetch } from "./use-the-fetch";
jest.mock("./use-the-fetch");

describe("list characters", () => {
  it("lists three", () => {
    useTheFetch.mockReturnValue({
      loading: false,
      data: {
        results: [
          {
            name: "Luke Skywalker"
          },
          {
            name: "C-3PO"
          },
          {
            name: "Darth Vader"
          }
        ]
      }
    });
    const { getAllByText, container } = render(<ListCharacters />);
    const selectList = getAllByText((_content, element) => {
      return element.tagName.toLowerCase() === "option";
    });

    expect(useTheFetch).toBeCalledWith("people");
    expect(container).toHaveTextContent("Luke Skywalker");
    expect(selectList).toHaveLength(3);
  });
});
```

Below we call `useTheFetch` hook which gets our Star Wars character data. The helpful thing about mocks is we can design the response we want from the function before it's implemented. Essentially we can design the specification for our next function and `useTheFetch` exists only as an empty module. 

```javascript
// list-character.js
import React from "react";
import { useTheFetch } from "./use-the-fetch";

export function ListCharacters() {
  const { data } = useTheFetch("people");
  return (
    <select>
      {data.results.map(character => (
        <option key={character.name}>{character.name}</option>
      ))}
    </select>
  );
}
```

```javascript
// use-the-fetch.js
export function useTheFetch(path) {}
```

Add in the loading state test:

```javascript
// list-character.spec.js
// ...
  it("loading state", () => {
    useTheFetch.mockReturnValue({
      loading: true,
      data: null
    });

    const { container } = render(<ListCharacters />);

    expect(useTheFetch).toHaveBeenCalled();
    expect(container).toHaveTextContent("Loading");
  });
// ...
```

```javascript
// list-characters.js
export function ListCharacters() {
  const { loading, data } = useTheFetch("people");

  return (
    <select>
      {!loading &&
        data.results.map(character => (
          <option key={character.name}>{character.name}</option>
        ))}
      {loading && <option>Loading ...</option>}
    </select>
  );
}
```

### Testing custom React Hooks

To test the custom hook `useTheFetch` two more dependencies will need to be installed. [`@testing-library/react-hooks`](https://github.com/testing-library/react-hooks-testing-library){:target="\_blank" rel="noopener"} is a helpful utility to make testing hooks clean and easy. This is because hooks can't be used outside of a functional React component. Another option is to test the hook's effect by the output of a component, but this maybe not ideal for a unit test.

```
npm i -D @testing-library/react-hooks react-test-renderer
```

Below I mock the `base-fetch` module which is responsible for making requests to the SWAPI endpoints and returning a JSON object. Instead of mocking out `fetch` which is a built-in browser API we simply create a wrapper around it. When mocking it's **important** [not to mock things you don't own](https://github.com/testdouble/contributing-tests/wiki/Don't-mock-what-you-don't-own){:target="\_blank" rel="noopener"} because you don't have control over the API and does not enable you to make good design decisions.

The two tests below check the initial state which is loading and then an updated state when the data has been fetched. There are more cases to handle, like errors, but here we keep it simple to illustrate the approach.

The mock method `getStarWars.mockResolvedValue` is used to emulate a promise and provide a return value which is why this test uses `async/await`.

```javascript
// use-the-fetch.spec.js
import { renderHook, act } from "@testing-library/react-hooks";
import { useTheFetch } from "./use-the-fetch";
import { getStarWars } from "./base-fetch";
jest.mock("./base-fetch");

describe("use the fetch", () => {
  it("initial data state is loading and data empty", () => {
    const { result } = renderHook(() => useTheFetch("people"));

    expect(result.current).toStrictEqual({ loading: true, data: null });
  });

  it("data is fetched and loading is complete", async () => {
    const fakeSWData = { result: [{ name: "Luke Skywalker" }] };
    getStarWars.mockResolvedValue(fakeSWData);
    const { result, waitForNextUpdate } = renderHook(() =>
      useTheFetch("people")
    );

    await waitForNextUpdate();

    expect(getStarWars).toBeCalledWith("people");
    expect(result.current).toStrictEqual({
      loading: false,
      data: fakeSWData
    });
  });
});
```

```javascript
// use-the-fetch.js
import { useState, useEffect } from "react";
import { getStarWars } from "./base-fetch";
export function useTheFetch(path) {
  const [result, setResult] = useState({ loading: true, data: null });
  async function fetchData() {
    const data = await getStarWars(path);
    setResult({ loading: false, data });
  }
  useEffect(() => {
    fetchData();
  }, []);

  return result;
}

```

### Thoughts on Test Doubles

Test Doubles are helpful tools in <abbr title="Test-driven development">TDD</abbr> and enabling you to better design your code. However, it is possible to mock too much which might make your tests fragile and unreliable. A general rule I like to follow is to mock only the edges of your app and these are the points of contact which deal with external services/libraries. To provide a bit more context to mocking read this post about [mocking is a code smell](https://medium.com/javascript-scene/mocking-is-a-code-smell-944a70c90a6a){:target="\_blank" rel="noopener"}.

### Summary

We have looked at how you can mock a custom React hook which fetches data from an external service and unit test it to the specification defined by the mock. Hopefully, this gives you a better set of tools and approach to test your React apps. 

You can play around with the above code examples in the GitHub repo I created [Star Wars React app tests](https://github.com/rkotze/starwars-react-app-tests){:target="\_blank" rel="noopener"}.

```
git clone git@github.com:rkotze/starwars-react-app-tests.git
```

If you have any feedback please write in the comments below or [tweet me](https://twitter.com/share?text=Mocking React hooks when unit testing using Jest @richardkotze &url=https://www.richardkotze.com/coding/mocking-react-hooks-unit-testing-jest&hashtags=javascript,reactjs,testing){:target="\_blank" rel="noopener"}.
