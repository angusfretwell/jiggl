import Router from 'koa-router';

import ConfigController from './controllers/ConfigController';
import WebhookController from './controllers/WebhookController';

const router = new Router();

router.get('/config', ::ConfigController.index);
router.post('/config', ::ConfigController.create);
router.get('/config/:id', ::ConfigController.show);
router.put('/config/:id', ::ConfigController.update);
router.del('/config/:id', ::ConfigController.destroy);

router.post('/webhooks', ::WebhookController.processWebhook);

export default router;
