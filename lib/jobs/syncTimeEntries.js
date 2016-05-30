import winston from 'winston';
import toggl from 'toggl-got';
import moment from 'moment';
import queue from '../queue';

const { TOGGL_WORKSPACE_ID } = process.env;

export default async function (_, done) {
  try {
    const promises = [];
    const since = moment().startOf('day').toISOString();
    const until = moment().toISOString();

    const { body } = await toggl(
      `details?workspace_id=${TOGGL_WORKSPACE_ID}&since=${since}&until=${until}&user_agent=jiggl`,
      { endpoint: 'https://toggl.com/reports/api/v2/' }
    );

    for (const entry of body.data) {
      // Filter out time entries not in TEST project when in debug mode
      if (process.env.DEBUG && entry.project.indexOf('TEST') < 0) {
        winston.debug(`Skipping time entry ${entry.id}`);
        continue;
      }

      promises.push(queue.create('sync time entry', entry).priority('medium').save());
    }

    await Promise.all(promises);

    winston.info('Sucessfully schronised time entries');
    return done();
  } catch (err) {
    winston.error('Failed to synchronise time entries', err);
    return done(err);
  }
}
