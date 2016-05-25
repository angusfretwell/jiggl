import winston from 'winston';
import TogglHelper from '../helpers/TogglHelper';

const TOGGL_FIELD = `customfield_${process.env.JIRA_TOGGL_FIELD_ID}`;

export default async function ({ data }, done) {
  const { issue } = data;
  const togglId = issue.fields[TOGGL_FIELD];

  if (!togglId) {
    winston.info(`Skipping ${issue.key} since it has no Toggl id`);
    return done();
  }

  try {
    const togglTask = await TogglHelper.updateTask(togglId, {
      active: false,
    });

    winston.info(`Archived Toggl task ${togglTask.body.data.id} for ${issue.key}`);
    return done();
  } catch (err) {
    winston.error(`Failed to archive Toggl task for ${issue.key}`, err);
    return done(err);
  }
}
