import winston from 'winston';
import TogglHelper from '../helpers/TogglHelper';
import JiraHelper from '../helpers/JiraHelper';

const customField = `customfield_${process.env.JIRA_CUSTOM_FIELD_ID}`;

export default async function ({ data }, done) {
  const { issue } = data;
  const { project, summary, timeoriginalestimate } = issue.fields;
  const togglId = issue.fields[customField];

  if (process.env.APP_DEBUG && issue.key.indexOf('TEST') < 0) {
    winston.info('Skipping issue since its key doesn\'t contain \'TEST\'');
    return done();
  }

  // Toggl task already exists, update the task name
  if (togglId) {
    try {
      const togglTask = await TogglHelper.updateTask(togglId, {
        name: `${issue.key}: ${summary}`,
        estimated_seconds: timeoriginalestimate || 0,
      });

      winston.info(`Updated Toggl task ${togglTask.body.data.id} for ${issue.key}`);
      return done();
    } catch (err) {
      winston.error(`Failed to update Toggl task for ${issue.key}`, err);
      return done(err);
    }
  }

  // Toggl task doesn't exist, create a new task
  try {
    const togglProject = await TogglHelper.getProject({
      key: project.key,
      name: project.name,
    });

    const togglTask = await TogglHelper.createTask({
      active: false,
      name: `${issue.key}: ${summary}`,
      estimated_seconds: timeoriginalestimate || 0,
      pid: togglProject.id,
    });

    await JiraHelper.updateTicket(issue.key, {
      [customField]: String(togglTask.body.data.id),
    });

    winston.info(`Created Toggl task ${togglTask.body.data.id} for ${issue.key}`);
    return done();
  } catch (err) {
    winston.error(`Failed to create Toggl task for ${issue.key}`, err);
    return done(err);
  }
}
