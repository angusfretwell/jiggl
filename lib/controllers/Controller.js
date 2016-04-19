import debug from 'debug';

export default class Controller {
  static debug(message) {
    debug(`jiggl:${this.name}`)(message);
  }

  static async index(ctx) {
    this.debug('index called');
    // TODO: make fetchAll work
    // const records = await new this.Model().fetchAll();
    // ctx.body = records;
    ctx.status = 200;
  }

  static async create(ctx) {
    this.debug('create called');
    const record = await new this.Model(ctx.request.body).save();
    ctx.body = record;
    ctx.status = 201;
  }

  static async show(ctx) {
    this.debug('show called');
    const record = await new this.Model({ id: ctx.params.id }).fetch();
    ctx.body = record;
    ctx.status = 200;
  }

  static async update(ctx) {
    this.debug('update called');
    const record = await new this.Model({ id: ctx.params.id }).fetch();
    await record.set(ctx.request.body).save();
    ctx.status = 200;
  }

  static async destroy(ctx) {
    this.debug('destroy called');
    await new this.Model({ id: ctx.params.id }).destroy();
    ctx.status = 204;
  }
}
