import { Router } from 'express';
import { healthRouter } from './features/health';
import { itemsRouter } from './features/items';

const router = Router();

router.use('/', healthRouter);
router.use('/items', itemsRouter);

export default router;

