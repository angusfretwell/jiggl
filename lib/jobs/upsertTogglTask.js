import winston from 'winston';
import toggl from 'toggl-got';
import jira from 'jira-got';
import TogglHelper from '../helpers/TogglHelper';

export default async function ({ data }, done) {
  const { project, summary } = data.issue.fields;

  // TODO: Check if ticket already has a Jiggl ID, update Toggl task name accordingly

  try {
    const togglProject = await TogglHelper.getProject(project.name);

    if (!togglProject) {
      // TODO: Create Toggl project if not found
    }

    const task = await toggl.post('tasks', {
      body: JSON.stringify({
        task: {
          name: `${data.issue.key}: ${summary}`,
          pid: togglProject.id,
        },
      }),
    });

    const response = await jira.put(`issue/${data.issue.key}`, {
      body: JSON.stringify({
        fields: {
          [`customfield_${process.env.JIRA_CUSTOM_FIELD_ID}`]: String(task.body.data.id),
        },
      }),
    });

    winston.debug(response);

    done();
  } catch (err) {
    winston.debug(`Failed to upsert Toggl task for ${data.issue.key}`, err);
    done(err);
  }
}
