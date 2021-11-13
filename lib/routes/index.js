import express from 'express';
import usuarios from './usuarios';
import carreras from './carreras';
import materias from './materias';
import roles from './rol';
import proyectos from './proyectos';
import tipohito from './tipohito';
import hito from './hitos';
import entregableshito from './entregableshito';
import alumnoproyecto from './alumnoproyecto';

const router = express.Router();

router.use('/api/usuarios', usuarios);
router.use('/api/carreras', carreras);
router.use('/api/materias', materias);
router.use('/api/roles', roles);
router.use('/api/proyectos', proyectos);
router.use('/api/tiposhito', tipohito);
router.use('/api/hitos', hito);
router.use('/api/entregablesHito', entregableshito);
router.use('/api/alumnoproyecto', alumnoproyecto);

export default router;
