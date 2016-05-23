import jira from 'jira-got';

export default class JiraHelper {
  static async updateTicket(key, fields) {
    return await jira.put(`issue/${key}`, {
      body: JSON.stringify({ fields }),
    });
  }
}
