import express from 'express';

import {
  index,
  show,
  create,
  update,
  ListByProyecto,
  closed,
  destroy,
} from '../controllers/hito_controller';
import { withErrorHandling } from './utils';

const router = express.Router();

router.get('/', withErrorHandling(index));
router.get('/:id', withErrorHandling(show));
router.post('/', withErrorHandling(create));
router.put('/:id', withErrorHandling(update));
router.put('/Closed/:id', withErrorHandling(closed));
router.get('/ListByProyecto/:id', withErrorHandling(ListByProyecto));
router.delete('/:id', withErrorHandling(destroy));

export default router;
