import winston from 'winston';
import jira from 'jira-got';
import JiraHelper from '../helpers/JiraHelper';
import TogglHelper from '../helpers/TogglHelper';

export default async function ({ data }, done) {
  const [jiraKey] = data.task.split(':');
  let ticket;

  try {
    ticket = await jira.get(`issue/${jiraKey}`);
  } catch (err) {
    winston.info(`Skipped time entry "${jiraKey}"; couldn't find Jira issue`);
    return done();
  }

  try {
    // Convert from ms
    const seconds = data.dur / 1000;

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

    // Find and add tags from the Jira ticket
    const tags = await JiraHelper.getTags(ticket.body.fields);
    await TogglHelper.updateTimeEntry(data.id, { tags });

    winston.info(`Sucessfully schronised time entry ${jiraKey}`);
    return done();
  } catch (err) {
    winston.error(`Failed to synchronise time entry ${jiraKey}`, err);
    return done(err);
  }
}
