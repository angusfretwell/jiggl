import debug from 'debug';
import swig from 'swig';
import { Config, Configs } from '../models/Config';

export default class IndexController {
  static debug(message) {
    debug('jiggl:JiraWebhookController')(message);
  }

  static async index(ctx) {
    let configs = await new Configs().fetch();
    configs = configs.toJSON();
    ctx.body = swig.renderFile('lib/views/index.html', { configs });
    ctx.status = 200;
  }

  static async save(ctx) {
    const configs = ctx.request.body;

    for (const config of Object.keys(configs)) {
      if (!config || !configs[config]) {
        continue;
      }

      let record = await new Config({ key: config }).fetch();

      if (!record) {
        record = await new Config();
      }

      await record.set({ key: config, value: configs[config] }).save();
    }

    ctx.redirect('back');
  }
}
