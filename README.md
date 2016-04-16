Jiggl
=====

[![Travis](https://img.shields.io/travis/angusfretwell/jiggl/master.svg)](https://travis-ci.org/angusfretwell/jiggl)
[![Code Climate](https://img.shields.io/codeclimate/github/angusfretwell/jiggl.svg)](https://codeclimate.com/github/angusfretwell/jiggl)
[![Codecov](https://img.shields.io/codecov/c/github/angusfretwell/jiggl.svg)](https://codecov.io/github/angusfretwell/jiggl)

Creates Toggl tasks from Jira tickets, and syncs time tracked in Toggl back to Jira.

![](http://i.imgur.com/MVSfOkZ.gif)

Development
-----------

1. Install [Node.js](https://nodejs.org/en/) 5.0.0 or later
2. Run `npm install` to install the application's dependencies
3. Copy the contents of `.env.example` into a `.env` file, and add your Jira and Toggl credentials

### Commands

```
npm start
```

Starts the application using [forever](https://github.com/foreverjs/forever).

```
npm run watch
```

Watches for changes and restarts the server automatically using [nodemon](https://github.com/remy/nodemon).

```
npm test
```

Runs tests using [mocha](http://mochajs.org).

```
npm run lint
```

Lints code using [eslint](http://eslint.org).

### Debugging

You can start Jiggl in debug mode by exporting scopes to the `DEBUG` environment variable (e.g. `jiggl:application` or `jiggl:*`).

```
DEBUG=jiggl:* npm run watch
```

License
-------

The MIT License (MIT)

Copyright (c) 2016 Angus Fretwell
