import debug from 'debug';
import jira from 'jira-got';

const GREENHOPPER_FIELD = `customfield_${process.env.JIRA_GREENHOPPER_FIELD_ID}`;
// TODO: Move this somewhere more appropriate
const CLOSED_STATUSES = ['Closed', 'Resolved', 'Done'];

export default class JiraHelper {
  static debug(message) {
    debug('jiggl:JiraHelper')(message);
  }

  static async updateTicket(key, fields) {
    this.debug('updateTicket called');
    return await jira.put(`issue/${key}`, {
      body: JSON.stringify({ fields }),
    });
  }

  static async createWorklog(key, fields) {
    this.debug('createWorklog called');
    return await jira.post(`issue/${key}/worklog`, {
      body: JSON.stringify(fields),
    });
  }

  static async updateWorklog(key, id, fields) {
    this.debug('updateWorklog called');
    return await jira.put(`issue/${key}/worklog/${id}`, {
      body: JSON.stringify(fields),
    });
  }

  static isActive(issue) {
    this.debug('isActive called');
    if (issue.fields[GREENHOPPER_FIELD] === null) {
      this.debug('issue not in a sprint');
      return false;
    }

    if (CLOSED_STATUSES.indexOf(issue.fields.status.name) >= 0) {
      this.debug('issue has a closed status');
      return false;
    }

    return true;
  }
}
