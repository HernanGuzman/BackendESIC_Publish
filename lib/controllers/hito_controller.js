import Hito from '../models/hito';
import TipoHito from '../models/tipohito';
import EntregablesHito from '../models/entregableshito';
import Proyecto from '../models/proyecto';
import AlumnoProyecto from '../models/alumnoproyecto';
import Usuario from '../models/usuario';
import {AlusProyect} from '../controllers/alumnoProyecto_controller';
import { sendMailAltaHito, sendMailHitoAprobado } from '../helpers/mail_sender';
import { altaHito, hitoAprobado} from '../config/mail_sender';

export const index = async (req, res) => {
  const Hitos = await Hito.findAll({});
  res.json({ data: Hitos.map((tipo) => tipo.toJSON()) });
};

export const ListByProyecto = async (req, res) => {
  let hitos = await Hito.findAll({
    where: {
      idProyecto: req.params.id,
    },
  });
  hitos = hitos.map((hito) => hito.toJSON());
  const hitosProyect = hitos.map(async (hito) => {
    const tipohito = await TipoHito.findByPk(hito.idTipo);
    return tipohito.toJSON();
  });
  const tipos = await Promise.all(hitosProyect);

  hitos.forEach((hito) => {
    console.log(hito);
    const tipoHito = tipos.find((t) => t.id === hito.idTipo);
    console.log(tipoHito);
    hito.tipoHito = tipoHito;
  });
  res.json({ hitos });
};

export const show = async (req, res) => {
  const hito = await Hito.findByPk(req.params.id);
  if (hito) {
    res.json({ data: hito.toJSON() });
  } else {
    res.status(404).json({
      message: `No se encontró un hito con id ${req.params.id}`,
    });
  }
};

export const update = async (req, res) => {
  try {
    if (
      req.body.descripcion !== undefined &&
      req.body.idTipo !== undefined &&
      req.body.idProyecto !== undefined &&
      req.body.fechaEntrega !== undefined
    ) {
      const hito = await Hito.findByPk(req.params.id);
      hito.descripcion = req.body.descripcion;
      hito.idTipo = req.body.idTipo;
      hito.idProyecto = req.body.idProyecto;
      hito.fechaEntrega = req.body.fechaEntrega;
      await hito.save();
      res.status(200).send({ id: hito.id });
    } else {
      if (req.body.descripcion === undefined) {
        res.status(400).json('Descripción no recibida');
      } else if (req.body.idTipo === undefined) {
        res.status(400).json('Id de tipo de Hito no recibido');
      } else if (req.body.idProyecto === undefined) {
        res.status(400).json('Id de Proyecto no recibido');
      } else {
        res.status(400).json('Fecha de entrega no recibida');
      }
    }
  } catch (err) {
    return res.status(500).send(err);
  }
};

export const closed = async (req, res) => {
  try {
    const hito = await Hito.findByPk(req.params.id);
    hito.entregado = true;
    await hito.save();
    const AlumnosProyect = await AlumnoProyecto.findAll({
      where: {
        idProyecto:hito.idProyecto,
        
      },
    });
    
    const alumnosProy = await AlumnosProyect.map(
      async (alu) => await Usuario.findByPk(alu.idAlumno)
    );
    const alusproy = await Promise.all(alumnosProy);
    const Proye = await Proyecto.findByPk(hito.idProyecto);
    const tipoHito = await TipoHito.findByPk(hito.idTipo);
      const alumnosProyect = alusproy.map(
        async (alumn) => {
          await sendMailHitoAprobado({
            destinatario: alumn.email,
            asunto: hitoAprobado,
            nombreUsuario: `${alumn.nombre} ${alumn.apellido}`,
            nombreProyecto: Proye.nombre,
            nombreHito: tipoHito.nombre,
            
            
          });
        }
      );
      const sendingMail = await Promise.all(alumnosProyect);
    res.status(200).send({ id: hito.id });
  } catch (err) {
    return res.status(500).send(err);
  }
};

const alumnosProyecto =  async (idProyecto) => {
  
  //Busco los alumnos del proyecto para enviar un email
  //const AlumnosProyect = AlusProyect(req.body.idProyecto);
  
  return alusproy;
}
export const create = async (req, res) => {
  try {
    if (
      req.body.descripcion !== undefined &&
      req.body.idTipo !== undefined &&
      req.body.idProyecto !== undefined &&
      req.body.fechaEntrega !== undefined
    ) {
      const hito = await Hito.create({
        descripcion: req.body.descripcion,
        idTipo: req.body.idTipo,
        idProyecto: req.body.idProyecto,
        fechaEntrega: req.body.fechaEntrega,
      });
      const Proye = await Proyecto.findByPk(idProyecto);
      const tipoHito = await TipoHito.findByPk(req.body.idTipo);
      const alusproy = alumnosProyecto(req.body.idProyecto);
      
      const alumnosProyect = alusproy.map(
        async (alumn) => {
          await sendMailAltaHito({
            destinatario: alumn.email,
            asunto: altaHito,
            nombreUsuario: `${alumn.nombre} ${alumn.apellido}`,
            nombreProyecto: Proye.nombre,
            nombreHito: tipoHito.nombre,
            
            
          });
        }
      );
      const sendingMail = await Promise.all(alumnosProyect);
      res.status(200).send({ id: hito.id });
    } else {
      if (req.body.descripcion === undefined) {
        res.status(400).json('Descripción no recibida');
      } else if (req.body.idTipo === undefined) {
        res.status(400).json('Id de tipo de Hito no recibido');
      } else if (req.body.idProyecto === undefined) {
        res.status(400).json('Id de Proyecto no recibido');
      } else {
        res.status(400).json('Fecha de entrega no recibida');
      }
    }
  } catch (err) {
    return res.status(500).send(err);
  }
};

export const destroy = async (req, res) => {
  const hito = await Hito.findByPk(req.params.id);
  if (hito) {
    const entregables = await EntregablesHito.findAll({
      where: {
        idHito: hito.id,
      },
    });
    if (entregables.length === 0) {
      await hito.destroy();
      res.status(200).json({ message: `Hito eliminado correctamente.` });
    } else {
      res.status(404).json({
        message: `No se puede eliminar el Hito porque existen entregables asociados.`,
      });
    }
  } else {
    res.status(404).json({
      message: `No se encontró un hito con id ${req.params.id}`,
    });
  }
};
