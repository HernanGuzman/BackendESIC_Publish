import express from 'express';

import {
  index,
  show,
  create,
  update,
  destroy,
  ListByEstudiante,
  ListByTutor,
  ListByMateria,
  ListByCarrera,
  AddEstudentToProject,
} from '../controllers/proyecto_controller';
import { withErrorHandling } from './utils';

const router = express.Router();

router.get('/', withErrorHandling(index));
router.get('/:id', withErrorHandling(show));
router.get('/ListByEstudiante/:idAlumno', withErrorHandling(ListByEstudiante));
router.get('/ListByTutor/:idTutor', withErrorHandling(ListByTutor));
router.get('/ListByMateria/:idMateria', withErrorHandling(ListByMateria));
router.get('/ListByCarrera/:idCarrera', withErrorHandling(ListByCarrera));
router.post('/', withErrorHandling(create));
router.post('/AddEstudentToProject/', withErrorHandling(AddEstudentToProject));
router.put('/:id', withErrorHandling(update));
router.delete('/:id', withErrorHandling(destroy));

export default router;
