import express from 'express';

import { destroy } from '../controllers/alumnoProyecto_controller';
import { withErrorHandling } from './utils';

const router = express.Router();
router.delete('/:idProyecto/:idAlumno', withErrorHandling(destroy));

export default router;
