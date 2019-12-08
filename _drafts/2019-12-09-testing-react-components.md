---
layout: post
title: "Mocking strategies for testing a React app using Jest"
date: 2019-12-07 12:00:12 +0000
permalink: /coding/mocking-strategies-testing-react-using-jest
category: coding
published: true
image: "testing-tools.jpg"
meta_description: >
  Examples on mocking a React component to test it using Jest and react-testing-library
excerpt_separator: <!--more-->
tags: javascript react unit-testing
---

This won't be a deep dive into unit testing components in a React app but I will present some options for mocking external APIs. This is seen a good practice at the unit test level as we don't want these tests dependant on external API which will slow the feedback down and make essentially it will make the test fragile. Mocking is typically used quite loosely and there is plenty of nuance when we throw _spies_ and _stubs_ in the mix. However, they do have particular meaning and I like they are all placed under the generic term of [Test Double](https://martinfowler.com/bliki/TestDouble.html){:target="\_blank" rel="noopener"} as described by Martin Fowler.

Essentially a mock is about replacing the actual implementation with a set of functions that enable you to assert how the function was used. Using test libraries like [Jest](https://jestjs.io/docs/en/mock-functions){:target="\_blank" rel="noopener"} we get this functionality to use in our asserts for example was it called and with the correct parameters. Jest has build a simple API for managing mocks and does not break out into a more generic Test Double library which I find gets confusing quick.

<!--more-->

First thing we are going to look at is with most React apps they make a http call to an service. In this example we make an a call to the [SWAPI](https://swapi.co/){:target="\_blank" rel="noopener"} API to get the names of characters in Star Wars. What we want to test is when that character is selected we show details of them.

### Getting started

You can go ahead an use [create react app](https://github.com/facebook/create-react-app){:target="\_blank" rel="noopener"} which comes with [react-testing-library](https://github.com/testing-library/react-testing-library){:target="\_blank" rel="noopener"} installed.

```
npx create-react-app your-app-name
```


**First we write a test** which checks that our fetch React hook is called with "people" as the first parameter and returns fake data to be rendered into a select list. The test also asserts there are three items and one contains Luke Skywalker.

```javascript
// list-character.spec.js
import React from "react";
import { render } from "@testing-library/react";

import { ListPeople } from "./list-characters";
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
    const { getAllByText, container } = render(<ListPeople />);
    const selectList = getAllByText((_content, element) => {
      return element.tagName.toLowerCase() === "option";
    });

    expect(useTheFetch).toBeCalledWith("people");
    expect(container).toHaveTextContent("Luke Skywalker");
    expect(selectList).toHaveLength(3);
  });
});
```

Below we call `useTheFetch` hook which get our Star Wars character data. The helpful thing about mocks in this case is we can design the response we want from the function before it's implemented. Essentially we can design the specification for our next function. In this case `useTheFetch` exists as an empty module. 

```javascript
// list-character.js
import React from "react";
import { useTheFetch } from "./use-the-fetch";

export function ListPeople() {
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

### Testing custom React Hooks

To test the custom hook we are creating two more dependencies will need to be installed. [`@testing-library/react-hooks`](https://github.com/testing-library/react-hooks-testing-library){:target="\_blank" rel="noopener"} is a helpful utility to make testing hooks clean and easy to test.

```
npm i -D @testing-library/react-hooks react-test-renderer
```

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

  it("data is fetched and not loading", async () => {
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

You can play around with the above code examples in the GitHub repo I created [Star Wars React app tests](https://github.com/rkotze/starwars-react-app-tests){:target="\_blank" rel="noopener"}