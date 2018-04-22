---
layout: post
title:  Composition in JavaScript
date:   2018-03-20 17:00:12 +0000
permalink: /coding/composition-in-javascript
category: coding
image: "lamborghini-huracan.jpg"
meta_description: >
 Using composition instead of classical inheritance in JavaScript
excerpt_separator: <!--more-->
---

Let's look at using **composition** instead **classical inheritance** in JavaScript.

JavaScript is an expressive language and is one reason I enjoy using it. An interesting feature is the ability to **compose** objects from simple objects _without inheritance_.

<!--more-->

![Lamborghini Huracan with text "composition over classical inheritance"](/images/lamborghini-huracan.jpg)

We will use cars to describe and provide examples of composition over inheritance.
## What is the difference between inheritance and composition

Inheritance typically creates a [**is-a**](https://en.wikipedia.org/wiki/Is-a){:target="\_blank"} relationship and composition creates a [**has-a**](https://en.wikipedia.org/wiki/Has-a){:target="\_blank"} relationship. Composition allows us to naturally build complex objects from simple components making it easier to reason about. Rather than trying to identify commonality between classes and building a complex relational structure.

[**Inheritance**](https://en.wikipedia.org/wiki/Inheritance_(object-oriented_programming)){:target="\_blank"} is when a class is based on another using the same implementation. A Lamborghini (_subclass_) would gaining methods and properties from a vehicle (_superclass_) like `brake` and `accelerate`. The Lambo will include its own properties like `colour`. This creates a relationship of a Lamborghini **is a** vehicle.

[**Composition**](https://en.wikipedia.org/wiki/Object_composition){:target="\_blank"} is about taking simple objects and combining them to build more complex ones. To build a Lamborghini you might define a function for constructing essential features like `engine`, `design` and `brakes`. This creates a relationship of a Lamborghini **has a** engine, brakes and design.

### Mixins is a way of achieving inheritance 

Example of inheritance is _mixins_ because `lamboShell` object derives its methods from the `vehicleMixin`. This is essentially coping properties and methods from one object to another but the context (`this`) will be `lamboShell`, which would lead to mutations of the original `lamboShell`. Ignoring this for the moment we have achieved inheritance and create a relationship of `lambo` _is a_ `vehicleMixin`

Below is an example of creating a mixin:

```javascript
const vehicleMixin = {
  set (name, value) {
    this[name] = value;
  },

  get (name) {
    return this[name];
  },
  
  speed: 0,
  
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
```

Using ES6 `Object.assign()` this copies one or more objects to a **target** object and returns the target object. Lodash `_.extend()` achieves the same result if you need older browser support.

### Composition, piecing it together

Taking a different approach to promoting **composition**, the code below defines a function `Lambo` that we can pass in expected car features like an engine. This is a basic implementation of Dependency Injection and uses private fields to reference the newly injected objects. `Lambo` implements its own features using the `Engine` for example to `slowDown` or `speedUp`, adjusting the speed of the Lambo as defined below.

We can then utilise privilege methods to manipulate the private data fields. 

Refactoring the example above to compose a Lambo:

```javascript
const Engine = {
  accelerate (speed, incrementSpeed) {
    return speed + incrementSpeed;
  },
  decelerate (speed, decrementSpeed) {
    return speed - decrementSpeed;
  }
}

const Breaks = {
  stop(speed) {
    if(speed > 0) this.stop(speed - 3);
    
    return 0;
  }
}

const Design = {
  colour: 'Orange',
  model: 'Huracan Spyder'
};

const Lambo = function(Design, Engine, Breaks){
  const design = Object.create(Design);
  const engine = Object.create(Engine);
  const breaks = Object.create(Breaks);
  const props = {
    speed: 0,
    colour: design.colour,
    model: design.model
  };
  
  return {
    set (name, value) {
      props[name] = value;
    },

    get (name) {
      return props[name];
    },
    
    log (name) {
      console.log(`${name}: ${props[name]}`)
    },
    
    slowDown() {
      props.speed = engine.decelerate(props.speed, 3);
    },
    
    speedUp() {
      props.speed = engine.accelerate(props.speed, 3);
    },
    
    stop(){
      props.speed = breaks.stop(props.speed);
    }
  }
};

const lambo = Lambo(Design, Engine, Breaks);
lambo.speedUp();
lambo.log('speed'); //-> 3
lambo.slowDown();
lambo.log('speed'); //-> 0

lambo.log('colour'); //-> orange
// we can change the colour
lambo.set('colour', 'black');
// see it has changed
lambo.log('colour'); //-> black
```

## Conclusion

Constructing code to be **composable** I believe makes it easier to reason about which should improve its readability. There is some overhead of reimplementing methods for example `Lambo.slowDown` is essentially an alias of `engine.decelerate`, which would not need to be done using inheritance. However, this tradeoff I think is worth it to make the code easier to follow, especially when an application becomes complex.