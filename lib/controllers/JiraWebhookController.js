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
    winston.info(`${body.issue_event_type_name} webhook caught for ${body.issue.key}`, body);
    queue.create('upsert toggl task', body).priority('high').save();
    ctx.status = 200;
  }
}
