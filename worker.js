require('./bootstrap');
const queue = require('./lib/queue');

queue.process('sync worklog', require('./lib/jobs/syncWorklog'));
queue.process('upsert toggl task', require('./lib/jobs/upsertTogglTask'));
queue.process('archive toggl task', require('./lib/jobs/archiveTogglTask'));
