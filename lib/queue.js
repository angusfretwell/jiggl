import kue from 'kue';
import winston from 'winston';

import upsertTogglTask from './jobs/upsertTogglTask';
import archiveTogglTask from './jobs/archiveTogglTask';

const queue = kue.createQueue({
  redis: process.env.REDIS_URL,
});

queue.process('upsert toggl task', upsertTogglTask);
queue.process('archive toggl task', archiveTogglTask);

queue.on('job enqueue', (id, type) =>
  winston.info(`Job ${id} got queued of type ${type}`)
);

queue.on('job complete', (id) => {
  kue.Job.get(id, (err, job) => {
    if (err) return;

    job.remove((err) => { // eslint-disable-line no-shadow
      if (err) throw err;
      winston.info(`Removed completed job ${job.id}`);
    });
  });
});

export default queue;
