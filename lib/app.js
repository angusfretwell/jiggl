import Koa from 'koa';

import logger from 'koa-logger';
import helmet from 'koa-helmet';
import error from 'koa-json-error';
import bodyParser from 'koa-bodyparser';

import router from './router';
import _debug from 'debug';

const debug = _debug('jiggl:application');
const app = new Koa();

debug('booting jiggl');

app.use(logger());
app.use(error());
app.use(helmet());
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000, () =>
  debug('server started on http://localhost:3000') // eslint-disable-line no-console
);

export default app;
