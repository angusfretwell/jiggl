require('./bootstrap');
const queue = require('./lib/queue');

queue.process('upsert toggl task', require('./lib/jobs/upsertTogglTask'));
queue.process('archive toggl task', require('./lib/jobs/archiveTogglTask'));
