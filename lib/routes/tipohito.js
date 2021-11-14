import express from 'express';

import {
  index,
  show,
  create,
  update,
  destroy,
  saludo
} from '../controllers/tipohito_controller';
import { withErrorHandling } from './utils';

const router = express.Router();

router.get('/', withErrorHandling(index));
router.get('/saludo', withErrorHandling(saludo));
router.get('/:id', withErrorHandling(show));
router.post('/', withErrorHandling(create));
router.put('/:id', withErrorHandling(update));
router.delete('/:id', withErrorHandling(destroy));

export default router;
