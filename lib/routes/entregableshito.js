import express from 'express';

import {
  index,
  show,
  create,
  update,
  ListByHito,
  ListUltimoByHito,
  devolucion,
  destroy,
} from '../controllers/entregableshito_controller';
import { withErrorHandling } from './utils';

const router = express.Router();

router.get('/', withErrorHandling(index));
router.get('/:id', withErrorHandling(show));
router.post('/', withErrorHandling(create));
router.put('/:id', withErrorHandling(update));
router.put('/devolucion/:id', withErrorHandling(devolucion));
router.get('/ListByHito/:id', withErrorHandling(ListByHito));
router.get('/ListUltimoByHito/:id', withErrorHandling(ListUltimoByHito));
router.delete('/:id', withErrorHandling(destroy));

export default router;
