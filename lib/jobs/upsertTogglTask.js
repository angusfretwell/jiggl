import winston from 'winston';
import TogglHelper from '../helpers/TogglHelper';
import JiraHelper from '../helpers/JiraHelper';

const TOGGL_FIELD = `customfield_${process.env.JIRA_TOGGL_FIELD_ID}`;

export default async function ({ data }, done) {
  const { issue } = data;
  const { project, summary, timeoriginalestimate } = issue.fields;
  const togglId = issue.fields[TOGGL_FIELD];

  // Toggl task already exists, update the task name
  if (togglId) {
    try {
      const togglTask = await TogglHelper.updateTask(togglId, {
        active: JiraHelper.isActive(issue),
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
      active: JiraHelper.isActive(issue),
      name: `${issue.key}: ${summary}`,
      estimated_seconds: timeoriginalestimate || 0,
      pid: togglProject.id,
    });

    await JiraHelper.updateIssue(issue.key, {
      [TOGGL_FIELD]: String(togglTask.body.data.id),
    });

    winston.info(`Created Toggl task ${togglTask.body.data.id} for ${issue.key}`);
    return done();
  } catch (err) {
    winston.error(`Failed to create Toggl task for ${issue.key}`, err);
    return done(err);
  }
}
