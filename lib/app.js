import Koa from 'koa';
import winston from 'winston';
import logger from 'koa-logger';
import helmet from 'koa-helmet';
import error from 'koa-error';
import bodyParser from 'koa-bodyparser';
import auth from 'koa-basic-auth';
import router from './router';
import localtunnel from './localtunnel';
import _debug from 'debug';

const debug = _debug('jiggl:app');
const app = new Koa();
const port = process.env.PORT || 3000;

debug('booting jiggl');

app.use(logger());
app.use(error());
app.use(helmet());
app.use(bodyParser());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.status === 401) {
      ctx.status = 401;
      ctx.set('WWW-Authenticate', 'Basic');
    } else {
      throw err;
    }
  }
});

if (!process.env.DEBUG) {
  app.use(auth({
    name: process.env.BASIC_AUTH_USERNAME,
    pass: process.env.BASIC_AUTH_PASSWORD,
  }));
}

app.use(router.routes());
app.use(router.allowedMethods());

app.listen(port, () => {
  winston.info(`server started on http://localhost:${port}`);

  if (process.env.LOCALTUNNEL) {
    localtunnel(port, {
      subdomain: process.env.LOCALTUNNEL,
    })
    .then((tunnel) => {
      winston.info(`localtunnel started on ${tunnel.url}`);
    });
  }
});

export default app;
