require('./bootstrap');
const queue = require('./lib/queue');

queue.process('sync time entries', require('./lib/jobs/syncTimeEntries'));
queue.process('sync time entry', require('./lib/jobs/syncTimeEntry'));
queue.process('upsert toggl task', require('./lib/jobs/upsertTogglTask'));
queue.process('archive toggl task', require('./lib/jobs/archiveTogglTask'));
