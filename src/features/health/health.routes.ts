import { Router } from 'express';
import { healthController } from './health.controller';

const router = Router();

router.get('/health', healthController.check);
router.get('/ready', healthController.ready);

export default router;

