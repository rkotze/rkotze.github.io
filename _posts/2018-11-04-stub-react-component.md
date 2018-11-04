---
layout: post
title: Stub a React component using Sinon
date: 2018-11-04 08:00:12 +0000
permalink: coding/stub-react-component-using-sinon
category: coding
published: true
# image: retro-arcade-gaming.jpg
meta_description: >
 How to stub a React component using Sinon.
excerpt_separator: <!--more-->
---

Stubbing a React component is easy with Sinon.

<!--more-->

## Error

### `default(...): Nothing was returned from render. This usually means a return statement is missing. Or, to render nothing, return null`

Importing the component to stub and stubbing it in the before hook.

Example code that causes the above error:

```javascript
import sinon from 'sinon';
import * as ToStubComponent from './to-stub-component';

describe('....', function () {
  before(function(){
    ...
    sinon.stub(ToStubComponent, 'default').returns(<div/>);
    ...
  });
  it('my test', ...);
});
```

## Solution

The issue from what I can tell is React is trying to execute the component as a `class` component and there is no `render` method available. This can be solved by stubbing as a string.

```javascript
sinon.stub(ToStubComponent, 'default').value('div');
```
