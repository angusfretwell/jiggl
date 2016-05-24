import debug from 'debug';
import winston from 'winston';
import queue from '../queue';

export default class WebhookController {
  static debug(message) {
    debug('jiggl:WebhookController')(message);
  }

  static async processWebhook(ctx) {
    this.debug('processWebhook called');
    const { body } = ctx.request;

    // Filter out issues without TEST key when in debug mode
    if (process.env.APP_DEBUG && body.issue.key.indexOf('TEST') < 0) {
      winston.info(`Skipping ${body.issue.key} in debug mode`);
      ctx.status = 200;
      return;
    }

    switch (body.issue_event_type_name) {
      case 'issue_deleted':
        queue.create('archive toggl task', body).priority('low').save();
        break;
      default:
        queue.create('upsert toggl task', body).priority('high').save();
    }

    winston.info(`${body.issue_event_type_name} webhook caught for ${body.issue.key}`, body);
    ctx.status = 200;
  }
}
