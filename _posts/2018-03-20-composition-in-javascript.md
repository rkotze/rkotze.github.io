---
layout: post
title:  Composition in JavaScript
date:   2018-03-20 17:00:12 +0000
permalink: /coding/composition-in-javascript
category: coding
meta_description: >
 Using composition instead of classical inheritance in JavaScript
excerpt_separator: <!--more-->
---

Let's look at using **composition** over **classical inheritance** in JavaScript.

JavaScript is an expressive language and is one reason I enjoy using it. An interesting feature is the ability to create and inherit from objects without classes and class inheritance. Using compositional tactics we can piece together multiple objects to form new ones.

<!--more-->

## Let's begin with Mixins

One of the ways is _mixins_. This is essentially coping properties and methods from one object to another. It can be achieved by using ES6 `Object.assign()` which copies one or more objects and returns a new object. Lodash `_.extend()` achieves the same result if you need older browser support.

Below is an example of creating a mixin:

{% highlight javascript %}
const vehicleMixin = {
  set (name, value) {
    this[name] = value;
  },

  get (name) {
    return this[name];
  },
  
  accelerate () {
    this.speed += 2;
    console.log(`accelerated: ${this.speed}`);
  },
  
  brake () {
    this.speed -= 4;
    console.log(`braking: ${this.speed}`);
  }
};

const lamboShell = { colour: 'orange', speed: 0 };
// combines both objects into one
const lambo = Object.assign(lamboShell, vehicleMixin);
// the lambo can now accelerate
lambo.accelerate();

// colour is not truly private can be accessed directly via lambo.colour
console.log(lambo.get('colour'));

lambo.colour = 'silver'; // will change value potentially breaking the state

{% endhighlight %}

## Functional inheritance

The next tactic is to use _functional inheritance_ similar to _mixins_ but you can use closures to enforce private data. We can then utilise privilege methods to manipulate the private data fields. Refactoring the example above to use functional inheritance:

{% highlight javascript %}
const vehicleMixin = function() {
  // this makes the props private and can't be changed without using privilege methods
  const props = Object.assign({}, this.props);
  
  return Object.assign(this, {
    set (name, value) {
      props[name] = value;
    },

    get (name) {
      return props[name];
    },
  
    accelerate () {
      props.speed += 2;
      console.log(`accelerated: ${props.speed}`);
    },
  
    brake () {
      props.speed -= 4;
      console.log(`braking: ${props.speed}`);
    }
  });
};

// apply the vehicle methods to any object
const compose = (target) => vehicleMixin.call(target);

const lamboShell = { props: { colour: 'orange', speed: 0 }};
const lambo = compose(lamboShell);

lambo.accelerate();

console.log(lambo.get('colour')); //-> orange
// we can change the colour
lambo.set('colour', 'black');
// see it has changed
console.log(lambo.get('colour')); //-> black
// try change color directly
lambo.props.colour = 'silver';
// Colour used by class stays black
console.log(lambo.get('colour')); //-> black
{% endhighlight %}

## Composition creates a different relationship

Classical inheritance typically creates an **is-a** relationship but in a way the mental model of **has-a** or **uses-a** is easier to grasp, which is achieved using composition.

```
const lambo = hasA(accelerator, brake, steeringWheel);
```

## Conclusion

Constructing code to be **composable** I believe makes it easier to reason about which should improve its readability. There is a little overhead of creating boiler code for example `lamboShell` object is not particularly useful until it is composed. However, this tradeoff I think is worth it to make the code easier to follow, especially when an application becomes complex.