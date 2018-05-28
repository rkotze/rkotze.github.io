---
layout: post
title: "React testing library & Jest"
date: 2018-05-30 12:00:12 +0000
permalink: /coding/react-testing-library-jest
category: coding
published: false
meta_description: >
 Try out Kent C. Dodds React testing library and Jest
excerpt_separator: <!--more-->
---

**How do you unit test your React components?** There are plenty testing libraries to help support testing your React app. I'm going to look at using [Jest](https://facebook.github.io/jest){:target="\_blank"} and Kent C. Dodds [React testing library](https://github.com/kentcdodds/react-testing-library){:target="\_blank"}

<!--more-->

## A quick reflection

When React was in it's `0.x` versions it was a real struggle to test your components. Lots of ideas and opinions but no clear test setup. One way was to render a component into a headless browser or an emulated DOM environment using the now deprecated method `React.render(<MyApp />, document.body)`. Then find the component in the DOM `dom = React.findDOMNode(component)`.

I worked on a React project where we decided to use JSDOM v3.x and this had some [painful setup](https://github.com/jsdom/jsdom/tree/3.x#contextify){:target="\_blank"} especially using a Windows OS. Having to install Python 2.7 and Visual Studios Express to compile native modules for your machine. All this to run tests locally but eventually it would _fairly_ consistently. Setting up a CI pipeline also had its challenges. I'm glad a lot of effort from the JavaScript community has go into improving JSDOM. Now it has become the default DOM environment to test your React app in. It is as simple as `npm i jsdom -D` and with a little setup it works.

## The debate of how to test your component

I have often had regular debates with colleagues about what kind of testing you're doing when building a React app, unit, integration or UI testing. The confusion comes from a few points:

- React combines the view with in a class
- You start off writing unit tests and start feel you're testing too many parts once
- Having access to the DOM in the test makes it easy to trigger events and asserting the result.

These things are not typical of unit testing in other frameworks and languages like C#.NET, Python, JavaScript. Frameworks that followed the MV* model would separate out your views from your data classes.

However I find it a good idea to take a step back from what you're use too and decide what is a unit test. It is normal for people have different views on this and I like how Martin Fowler sets this out:

> But really it's a situational thing - the team decides what makes sense to be a unit for the purposes of their understanding of the system and its testing. [Martin Fowler]

Kent C. Dodds has done something similar in _React testing library_. By defining a clear way React unit tests should be written, this precedent is really useful for aligning a team on how to approach testing in their app. This principle is:

> [The more your tests resemble the way your software is used, the more confidence they can give you.](https://twitter.com/kentcdodds/status/977018512689455106){:target="\_blank"}

This approach means testing your components in a similar way to how a user would use your app. Technically the library queries and interacts with the rendered DOM nodes. To me this is similar to UI testing which is typically slow but setting it up like a unit test environment makes it fast.

## Setup time to write the first test

I'm going to add this to an existing project and see how long it takes to setup to start writing a passing unit test.

1. `npm i jest react-testing-library dom-testing-library -D`
1. Update `package.json` scripts test with `jest`
1. Write test for "hello world"
1. Had to add a `.babelrc` file for jest to parse the React component JSX

First basic test to get started:

```javascript
import React from 'react';
import { render } from 'react-testing-library';
import 'dom-testing-library/extend-expect';

const Hello = () => <h1>Hello World</h1>

test('first hello test', () => {
  const { container } = render(<Hello />);

  expect(container).toHaveTextContent('Hello World');
});
```

**Time:** 13 mins & 18 secs

This is a great time, very little spent on configuring the test setup to fit in the project. I added the example to an existing React template project in this [commit][react testing library commit]. The reason I added this project is because I was interested in how long it would take to setup a unit testing environment. What helped a lot was using _Jest_ as it already comes with _JSDOM_ and expects `.babelrc` in case you're using something like JSX which it needs to compile.

I spent about 10 minutes looking running the tests without the `.babelrc` and just using the `webpack.config.js` file, but there does not seem to be a clear solution to that. If anyone knows how, please let me know.

## A more complex example test

I've created a simple component to fetch the contributors for a repository `git-mob` from Github. The user will need to click a button to get the information. The contributors will be rendered into a basic profile list showing username, avatar and commit count. Below is the test I created:

```javascript
import React from 'react';
import { render, Simulate, wait } from 'react-testing-library'
import 'dom-testing-library/extend-expect';
import { FetchGitMobContributors } from './fetch-git-mob-contributors';

beforeAll(function () {

  global.fetch = jest.fn().mockImplementation(async () => {
    return {
      ok: true,
      json: function () {
        return [
          {
            "total": 59,
            "author": {
              "login": "rkotze",
              "id": 1234,
              "avatar_url": "https://avatars2.githubusercontent.com/u/1234?v=4"
            }
          },
          {
            "total": 122,
            "author": {
              "login": "dideler",
              "id": 4567,
              "avatar_url": "https://avatars2.githubusercontent.com/u/4567?v=4"
            }
          }
        ]
      }
    };
  });

});

test('Click button to fetch git mob contributors and display in a list', async () => {
  const { getByText, getAllByTestId, getByTestId, container } = render(<FetchGitMobContributors />);

  Simulate.click(getByText('Fetch Git Mob contributors'));

  await wait(() => getByTestId('contributor'));

  expect(fetch).toHaveBeenCalledTimes(1);

  const contributors = getAllByTestId('contributor');
  expect(contributors).toHaveLength(2);

  expect(contributors[0]).toHaveTextContent('rkotze')
  expect(contributors[0]).toHaveTextContent('59');

  expect(contributors[1]).toHaveTextContent('dideler')
  expect(contributors[1]).toHaveTextContent('122');
});
```

1. Mock `fetch` using `jest.fn().mockImplementation` with the response we want
1. Then following the example provided by React testing library we click the button to trigger the fetch
1. Wait for the contributors to be rendered
1. Assert on the expected outcomes

Here is the [commit][complex test commit] showing the full implementation of the above.

## Conclusion

I find the React testing library API intuitive and easy to use. I did not run into any major issues that blocked me from testing in these two cases. It did not take long at all to setup the testing environment and get a basic Hello World example passing. This is a **huge** improvement from two years ago when it felt like it took forever to get started with testing and battling through flaky environments. Jest has obviously put a lot of effort into helping developers getting started quickly, especially for React applications.

[Martin Fowler]: https://martinfowler.com/bliki/UnitTest.html
[react testing library commit]: https://github.com/rkotze/universal-react-starter/commit/13cf721d561200bf09bbed43f0bbe116fb29f837
[complex test commit]: https://github.com/rkotze/universal-react-starter/commit/de44c12c2490838b619b194710ada9f1aff60d68