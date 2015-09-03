[travis]: https://travis-ci.org/neopoly/neocore-js
[travis-badge]: https://img.shields.io/travis/neopoly/neocore-js.svg?branch=master

# neocore

[![Travis][travis-badge]][travis]

*New* core js utils, like DI helpers, react-mixins, ...

## Install

```
npm install --save neocore
```

## Usage

```
var Context = require("neocore/context/context").Context;

var 
  context = new Context(),
  a_service = {
    say_hello: function(){console.log("hello");}
  };

context.service.registerInstance("a service", a_service);
```

## Run tests

```
grunt test
```

## Release new Version

```
npm publish
```

...then manually update bower.json version to the same and run push!