import Koa from 'koa';

import winston from 'winston';
import logger from 'koa-logger';
import helmet from 'koa-helmet';
import error from 'koa-json-error';
import bodyParser from 'koa-bodyparser';

import router from './router';
import localtunnel from './localtunnel';
import _debug from 'debug';

const debug = _debug('jiggl:app');
const app = new Koa();

debug('booting jiggl');

app.use(logger());
app.use(error());
app.use(helmet());
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000, () => {
  winston.info('server started on http://localhost:3000');

  if (process.env.LOCALTUNNEL) {
    localtunnel(3000, {
      subdomain: process.env.LOCALTUNNEL,
    })
    .then((tunnel) => {
      winston.info(`localtunnel started on ${tunnel.url}`);
    });
  }
});

export default app;
