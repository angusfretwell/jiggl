import winston from 'winston';
import TogglHelper from '../helpers/TogglHelper';
import JiraHelper from '../helpers/JiraHelper';

const TOGGL_FIELD = `customfield_${process.env.JIRA_TOGGL_FIELD_ID}`;

async function updateTogglTask(issue, togglId) {
  const { summary, timeoriginalestimate } = issue.fields;

  return await TogglHelper.updateTask(togglId, {
    active: JiraHelper.isActive(issue),
    name: `${issue.key}: ${summary}`,
    estimated_seconds: timeoriginalestimate || 0,
  });
}

async function createTogglTask(issue) {
  const { project, summary, timeoriginalestimate } = issue.fields;

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

  return togglTask;
}

export default async function ({ data }, done) {
  const { issue } = data;
  const togglId = issue.fields[TOGGL_FIELD];

  // Toggl task already exists, update the task name
  if (togglId) {
    try {
      const togglTask = await updateTogglTask(issue, togglId, done);
      winston.info(`Updated Toggl task ${togglTask.body.data.id} for ${issue.key}`);
      return done();
    } catch (err) {
      winston.error(`Failed to update Toggl task for ${issue.key}`, err);
      return done(err);
    }
  }

  // Toggl task doesn't exist, create a new task
  try {
    const togglTask = await createTogglTask(issue, done);
    winston.info(`Created Toggl task ${togglTask.body.data.id} for ${issue.key}`);
    return done();
  } catch (err) {
    winston.error(`Failed to create Toggl task for ${issue.key}`, err);
    return done(err);
  }
}
