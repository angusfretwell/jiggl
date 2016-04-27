import debug from 'debug';
import winston from 'winston';
import queue from '../queue';

export default class WebhookController {
  static debug(message) {
    debug('jiggl:WebhookController')(message);
  }

  static async processWebhook(ctx) {
    console.log(ctx.request.body);
    this.debug('processWebhook called');
    const { body } = ctx.request;
    winston.info(`${body.issue_event_type_name} webhook caught for ${body.issue.key}`, body);
    queue.create('upsert timer', body).priority('high').save();
    ctx.status = 200;
  }
}
