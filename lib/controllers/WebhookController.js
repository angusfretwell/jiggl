import Controller from './Controller';

export default class WebhookController extends Controller {
  static async processWebhook(ctx) {
    this.debug('processWebhook called');
    console.log(ctx); // eslint-disable-line no-console
  }
}
