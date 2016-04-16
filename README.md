Jiggl
=====

[![Travis](https://img.shields.io/travis/angusfretwell/jiggl/master.svg)](https://travis-ci.org/angusfretwell/jiggl)
[![Code Climate](https://img.shields.io/codeclimate/github/angusfretwell/jiggl.svg)](https://codeclimate.com/github/angusfretwell/jiggl)
[![Codecov](https://img.shields.io/codecov/c/github/angusfretwell/jiggl.svg)](https://codecov.io/github/angusfretwell/jiggl)

Creates Toggl tasks from Jira tickets, and syncs time tracked in Toggl back to Jira.

Development
-----------

1. Install [Node.js](https://nodejs.org/en/) 5.0.0 or later
2. Run `npm install` to install the application's dependencies

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

License
-------

The MIT License (MIT)

Copyright (c) 2016 Angus Fretwell

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
