import Koa from 'koa';

import logger from 'koa-logger';
import helmet from 'koa-helmet';
import error from 'koa-json-error';
import router from './router';

const app = new Koa();

app.use(logger());
app.use(error());
app.use(helmet());
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(3000, () =>
  console.log('Server started on http://localhost:3000') // eslint-disable-line no-console
);

export default app;
