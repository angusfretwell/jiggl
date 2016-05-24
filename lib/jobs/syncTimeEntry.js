import winston from 'winston';
import jira from 'jira-got';
import JiraHelper from '../helpers/JiraHelper';

export default async function ({ data }, done) {
  const [jiraKey] = data.task.split(':');

  try {
    const ticket = await jira.get(`issue/${jiraKey}`);
    const seconds = data.dur / 1000; // Convert from ms

    const [worklog] = ticket.body.fields.worklog.worklogs
      .filter(l => l.comment === String(data.id));

    if (worklog && worklog.timeSpentSeconds !== seconds) {
      // If worklog entry exists but time is different, update it
      await JiraHelper.updateWorklog(jiraKey, worklog.id, {
        timeSpentSeconds: seconds,
      });
    } else if (!worklog) {
      // If worklog entry does not exist, create one
      await JiraHelper.createWorklog(jiraKey, {
        timeSpentSeconds: seconds,
        comment: String(data.id),
      });
    }

    return done();
  } catch (err) {
    winston.error('Failed', err);
    return done(err);
  }
}
