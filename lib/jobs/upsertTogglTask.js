import winston from 'winston';
import TogglHelper from '../helpers/TogglHelper';
import JiraHelper from '../helpers/JiraHelper';

const customField = `customfield_${process.env.JIRA_CUSTOM_FIELD_ID}`;

export default async function ({ data }, done) {
  const { issue } = data;
  const { project, summary, timeoriginalestimate } = issue.fields;
  const togglId = data.issue.fields[customField];

  // Toggl task already exists, update the task name
  if (togglId) {
    try {
      const togglTask = await TogglHelper.updateTask(togglId, {
        name: `${data.issue.key}: ${summary}`,
        estimated_seconds: timeoriginalestimate || 0,
      });

      winston.info(`Update Toggl task ${togglTask.body.data.id} for ${data.issue.key}`);
      return done();
    } catch (err) {
      winston.error(`Failed to update Toggl task for ${data.issue.key}`, err);
      return done(err);
    }
  }

  try {
    // TODO: Check for project mapping

    let togglProject = await TogglHelper.getProject(project.name);

    // Create a new project if we couldn't find one
    if (!togglProject) {
      const response = await TogglHelper.createProject({
        name: project.name,
      });

      togglProject = response.body.data;

      // TODO: Create project mapping
    }

    const togglTask = await TogglHelper.createTask({
      name: `${data.issue.key}: ${summary}`,
      estimated_seconds: timeoriginalestimate || 0,
      pid: togglProject.id,
    });

    await JiraHelper.updateTicket(data.issue.key, {
      [customField]: String(togglTask.body.data.id),
    });

    winston.info(`Created Toggl task ${togglTask.body.data.id} for ${data.issue.key}`);
    return done();
  } catch (err) {
    winston.error(`Failed to create Toggl task for ${data.issue.key}`, err);
    return done(err);
  }
}
