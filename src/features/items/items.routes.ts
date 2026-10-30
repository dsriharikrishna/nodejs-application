import { Router } from 'express';
import { itemsController } from './items.controller';
import { validate } from '../../shared/middleware/validate';
import { createItemSchema, updateItemSchema, listQuerySchema } from './items.schema';

const router = Router();

router.get('/', validate(listQuerySchema, 'query'), itemsController.list);
router.get('/:id', itemsController.getOne);
router.post('/', validate(createItemSchema), itemsController.create);
router.put('/:id', validate(updateItemSchema), itemsController.update);
router.delete('/:id', itemsController.remove);

export default router;

