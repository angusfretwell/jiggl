#!/usr/bin/env node

require('../bootstrap');
const queue = require('../lib/queue');

queue.create('sync worklog').priority('medium').save();
process.exit();
