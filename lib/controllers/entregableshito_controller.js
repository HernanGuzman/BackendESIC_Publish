import EntregablesHito from '../models/entregableshito';
import Hito from '../models/hito';
import Proyecto from '../models/proyecto';
import Usuario from '../models/usuario';
import AlumnoProyecto from '../models/alumnoproyecto';
import { sendMailEntregable, sendMailDevolucionHito } from '../helpers/mail_sender';
import { entregable, devolucionHito} from '../config/mail_sender';
import TipoHito from '../models/tipohito';

export const index = async (req, res) => {
  const Entregables = await EntregablesHito.findAll({});
  res.json({ data: Entregables.map((ent) => ent.toJSON()) });
};

export const ListByHito = async (req, res) => {
  const Entregables = await EntregablesHito.findAll({
    where: {
      idHito: req.params.id,
    },
  });
  res.json({ data: Entregables.map((ent) => ent.toJSON()) });
};

export const ListUltimoByHito = async (req, res) => {
  console.log('LLega al metodo ultimo hito');
  let Entregables = await EntregablesHito.findAll({
    where: {
      idHito: req.params.id,
    },
  });
  Entregables = Entregables.map((entregable) => entregable.toJSON());
  let mayor = 0;
  let Entre = null;
  Entregables.forEach((entregable) => {
    if (entregable.id > mayor) {
      mayor = entregable.id;
      Entre = entregable;
    }
  });
  res.json({ data: Entre });
};

export const show = async (req, res) => {
  const Entregable = await EntregablesHito.findByPk(req.params.id);
  if (Entregable) {
    res.json({ data: Entregable.toJSON() });
  } else {
    res.status(404).json({
      message: `No se encontró un entregable con id ${req.params.id}`,
    });
  }
};

export const update = async (req, res) => {
  try {
    //SOLO SE PERMITE MODIFICAR EL DOCUMENTO Y LA ACLARACION DE LA ENTREGA
    if (req.body.entrega !== undefined && req.body.documento !== undefined) {
      const Entregable = await EntregablesHito.findByPk(req.params.id);
      Entregable.entrega = req.body.entrega;
      Entregable.documento = req.body.documento;
      await Entregable.save();
      res.status(200).send({ id: Entregable.id });
    } else {
      if (req.body.documento === undefined) {
        res.status(400).json('Documento no recibido');
      } else {
        res.status(400).json('Descripción de entrega no recibida');
      }
    }
  } catch (err) {
    return res.status(500).send(err);
  }
};


export const devolucion = async (req, res) => {
  try {
    //SOLO SE PERMITE MODIFICAR LA DEVOLUCION DEL HITO
    if (req.body.devolucion !== undefined) {
      const Entregable = await EntregablesHito.findByPk(req.params.id);
      Entregable.devolucion = req.body.devolucion;
      await Entregable.save();

      const hito = await Hito.findByPk(Entregable.idHito);
      
      const Proye = await Proyecto.findByPk(hito.idProyecto);
     
      const tipoHito = await TipoHito.findByPk(hito.idTipo);
      
      const AlumnosProyect = await AlumnoProyecto.findAll({
        where: {
          idProyecto:hito.idProyecto,
          
        },
      });
     
      const alumnosProy = await AlumnosProyect.map(
        async (alu) => await Usuario.findByPk(alu.idAlumno)
      );
      const alusproy = await Promise.all(alumnosProy);
      
      
        
      const alumnosProyect = alusproy.map(
        async (alumn) => {
          await sendMailDevolucionHito({
            destinatario: alumn.email,
            asunto: devolucionHito,
            nombreUsuario: `${alumn.nombre} ${alumn.apellido}`,
            nombreProyecto: Proye.nombre,
            nombreHito: tipoHito.nombre,
            
            
          });
        }
      );
      const sendingMail = await Promise.all(alumnosProyect);
      
      res.status(200).send({ id: Entregable.id });
    } else {
      res.status(400).json('Descripción de devolución no recibida');
    }
  } catch (err) {
    return res.status(500).send(err);
  }
};

export const create = async (req, res) => {
  try {
    if (
      req.body.idHito !== undefined &&
      req.body.entrega !== undefined &&
      req.body.documento !== undefined
    ) {
      const Entregables = await EntregablesHito.findAll({
        where: {
          idHito: req.body.idHito,
        },
      });
      const Entregable = await EntregablesHito.create({
        idHito: req.body.idHito,
        numVersion: Entregables.length + 1,
        entrega: req.body.entrega,
        devolucion: '',
        documento: req.body.documento,
      });
      //BUSCO EL HITO
      const Hit = await Hito.findByPk(req.body.idHito);
      const tipoHit = await TipoHito.findByPk(Hit.idTipo);
      const Proyect = await Proyecto.findByPk(Hit.idProyecto);
      const Tut = await Usuario.findByPk(Proyect.idTutor);
      
      await sendMailEntregable({
        destinatario: Tut.email,
        asunto: entregable,
        nombreUsuario: `${Tut.nombre} ${Tut.apellido}`,
        nombreProyecto: Proyect.nombre,
        nombreHito: tipoHit.nombre,
        
        
      });
          
      res.status(200).send({ id: Entregable.id });
    } else {
      if (req.body.idHito === undefined) {
        res.status(400).json('Id de Hito no recibido');
      } else if (req.body.documento === undefined) {
        res.status(400).json('Documento no recibido');
      } else {
        res.status(400).json('Descripción de entrega no recibida');
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

export const destroy = async (req, res) => {
  const Entregable = await EntregablesHito.findByPk(req.params.id);
  if (Entregable) {
    await Entregable.destroy();
    res.status(200).json({ message: `Entrega eliminada correctamente.` });
  } else {
    res
      .status(404)
      .json({ message: `No se encontró una entrega con id ${req.params.id}` });
  }
};
