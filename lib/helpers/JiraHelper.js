import jira from 'jira-got';

const GREENHOPPER_FIELD = `customfield_${process.env.JIRA_GREENHOPPER_FIELD_ID}`;
// TODO: Move this somewhere more appropriate
const CLOSED_STATUSES = ['Closed', 'Resolved', 'Done'];

export default class JiraHelper {
  static async updateTicket(key, fields) {
    return await jira.put(`issue/${key}`, {
      body: JSON.stringify({ fields }),
    });
  }

  static isActive(issue) {
    if (issue.fields[GREENHOPPER_FIELD] === null) {
      return false;
    }

    if (CLOSED_STATUSES.indexOf(issue.fields.status.name) >= 0) {
      return false;
    }

    return true;
  }
}
