import jira from 'jira-got';

const GREENHOPPER_FIELD = `customfield_${process.env.JIRA_GREENHOPPER_FIELD_ID}`;
const EPIC_KEY_FIELD = `customfield_${process.env.JIRA_EPIC_KEY_FIELD_ID}`;
const EPIC_NAME_FIELD = `customfield_${process.env.JIRA_EPIC_NAME_FIELD_ID}`;

// TODO: Move this somewhere more appropriate
const CLOSED_STATUSES = ['Closed', 'Resolved', 'Done'];

export default class JiraHelper {
  static async getIssue(key) {
    return await jira.get(`issue/${key}`);
  }

  static async updateIssue(key, fields) {
    return await jira.put(`issue/${key}`, {
      body: JSON.stringify({ fields }),
    });
  }

  static async createWorklog(key, fields) {
    return await jira.post(`issue/${key}/worklog`, {
      body: JSON.stringify(fields),
    });
  }

  static async updateWorklog(key, id, fields) {
    return await jira.put(`issue/${key}/worklog/${id}`, {
      body: JSON.stringify(fields),
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

  static getSprintName(field) {
    return field[0].match(/name=(.*?)(?=,)/g)[0].split('=')[1];
  }

  static async getTags(fields) {
    const tags = [
      // Add the sprint name
      this.getSprintName(fields[GREENHOPPER_FIELD]),
      // Add the issue type name
      fields.issuetype.name,
    ].concat(
      // Add the name of all versions
      fields.fixVersions.map(v => v.name),
      // Add the name of all components
      fields.components.map(c => c.name),
      // Add all labels
      fields.labels
    );

    // If the issue has a linked epic, find the issue and tag its name
    if (fields[EPIC_KEY_FIELD]) {
      const epic = await this.getIssue(fields[EPIC_KEY_FIELD]);
      tags.push(epic.body.fields[EPIC_NAME_FIELD]);
    }

    return tags;
  }
}
