import debug from 'debug';
import winston from 'winston';
import queue from '../queue';

export default class JiraWebhookController {
  static debug(message) {
    debug('jiggl:JiraWebhookController')(message);
  }

  static async processWebhook(ctx) {
    this.debug('processWebhook called');
    const { body } = ctx.request;

    // Filter out issues without TEST key when in debug mode
    if (process.env.DEBUG && body.issue.key.indexOf('TEST') < 0) {
      winston.debug(`Skipping issue ${body.issue.key}`);
      ctx.status = 200;
      return;
    }

    switch (body.issue_event_type_name) {
      case 'issue_deleted':
        queue
          .create('archive toggl task', body)
          .priority('low')
          .removeOnComplete(true)
          .save();
        break;
      default:
        queue
          .create('upsert toggl task', body)
          .priority('high')
          .removeOnComplete(true)
          .save();
    }

    winston.info(`${body.issue_event_type_name} webhook caught for ${body.issue.key}`, body);
    ctx.status = 200;
  }
}
