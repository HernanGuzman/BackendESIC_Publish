import {
  index,
  show,
  create,
  update,
  destroy,
  login,
  ListByRol,
  ListEstudiantes,
  saludo,
} from '../controllers/usuario_controller';
import { errorAwareRouter, verificarAutenticacion } from './utils';

const router = errorAwareRouter();

//AGREGAR EL MIDELWARE A TODAS LAS RUTAS
router.get('/', index, verificarAutenticacion);
router.get('/:id', show, verificarAutenticacion);
router.get('/ListByRol/:idRol', ListByRol, verificarAutenticacion);
router.get('/ListEstudiante/:idRol', ListEstudiantes);
router.post('/', create, verificarAutenticacion);
router.put('/:id', update, verificarAutenticacion);
router.delete('/:id', destroy, verificarAutenticacion);
router.post('/login', login);
router.get('/', saludo);

export default router;
