import Router from 'koa-router';

import helloWorld from './controllers/helloWorld';

const router = new Router();

router.get('/', helloWorld.index);

export default router;
