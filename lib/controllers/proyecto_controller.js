import Proyecto from '../models/proyecto';
import AlumnoProyecto from '../models/alumnoproyecto';
import Usuario from '../models/usuario';
import Materia from '../models/materia';
import Hito from '../models/hito';
import TipoHito from '../models/tipohito';
import { sendMailAltaProyecto } from '../helpers/mail_sender';
import { concat } from 'ramda';
import { asuntoRecuperarContrasenia, host } from '../config/mail_sender';
import { altaProyecto} from '../config/mail_sender';


export const index = async (req, res) => {
  const proyectos = await Proyecto.findAll({});
  res.json({ data: proyectos.map((proyecto) => proyecto.toJSON()) });
};

export const show = async (req, res) => {
  const proyecto = await Proyecto.findByPk(req.params.id);
  //AGREGAR LOS ALUMNOS AL RESPONSE
  if (proyecto) {
    //const dataProyecto = proyecto.toJSON();
    const aluProyecto = await AlumnoProyecto.findAll({
      where: {
        //proyectos.map((proyecto) => proyecto.toJSON());
        idProyecto: proyecto.id,
      },
    });

    const alumnosProyecto = await aluProyecto.map(
      async (alu) => await Usuario.findByPk(alu.idAlumno)
    );
    const alumnos = await Promise.all(alumnosProyecto);

    const tutor = await Usuario.findByPk(proyecto.idTutor);
    const materia = await Materia.findByPk(proyecto.idMateria);

    let hitos = await Hito.findAll({
      where: {
        idProyecto: proyecto.id,
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

    res.json({ proyecto, alumnos, tutor, materia, hitos });
  } else {
    res
      .status(404)
      .json({ message: `No se encontró el proyecto con id ${req.params.id}` });
  }
};

export const ListByEstudiante = async (req, res) => {
  //BUSCO LOS PROYECTOS DEL ESTUDUANTE
  const aluProyectoAll = await AlumnoProyecto.findAll({
    where: {
      //proyectos.map((proyecto) => proyecto.toJSON());
      idAlumno: req.params.idAlumno,
    },
  });
  console.log(aluProyectoAll);
  //SI ENCUENTRO PROYECTOS DEL ALUMNO BUSCO LOS QUE ESTAN SIN CERRAR
  if (aluProyectoAll.length > 0) {
    const proyectos = await aluProyectoAll.map(
      async (alu) => await Proyecto.findByPk(alu.idProyecto)
    );
    let proyects = await Promise.all(proyectos);
    //BUSCO TODOS LOS TUTORES
    let tutores = await Usuario.findAll({
      where: {
        idRol: 2,
      },
    });
    proyects = proyects.map((proy) => proy.toJSON());
    tutores = tutores.map((tutor) => tutor.toJSON());
    //LISTO TODAS LAS MATERIAS
    let materias = await Materia.findAll({});
    materias = materias.map((materia) => materia.toJSON());

    proyects.forEach((proyect) => {
      if (proyect.fechaFin != null) {
        const mat = materias.find((m) => m.id === proyect.idMateria);
        proyect.materia = mat;
        console.log(mat);
        const tut = tutores.find((t) => t.id === proyect.idTutor);
        proyect.tutor = tut;
        console.log(tut);
      }
    });

    res.json({ proyects });
  } else {
    res
      .status(404)
      .json({ message: `No se encontró ningun proyecto para el estudiante` });
  }
};

export const ListByTutor = async (req, res) => {
  //BUSCO LOS PROYECTOS DEL TUTOR
  const proyectos = await Proyecto.findAll({
    where: {
      //proyectos.map((proyecto) => proyecto.toJSON());
      idTutor: req.params.idTutor,
    },
  });
  let proyects = await Promise.all(proyectos);

  if (proyects.length > 0) {
    res.json({ proyects });
  } else {
    res
      .status(404)
      .json({ message: `No se encontró ningun proyecto para el estudiante` });
  }
};

export const ListByMateria = async (req, res) => {
  //BUSCO LOS PROYECTOS DEL TUTOR
  const proyectos = await Proyecto.findAll({
    where: {
      //proyectos.map((proyecto) => proyecto.toJSON());
      idMateria: req.params.idMateria,
    },
  });
  let proyects = await Promise.all(proyectos);

  if (proyects.length > 0) {
    res.json({ proyects });
  } else {
    res
      .status(404)
      .json({ message: `No se encontró ningun proyecto para la materia` });
  }
};

export const ListByCarrera = async (req, res) => {
  console.log(req.params.idCarrera);
  //BUSCO LOS PROYECTOS DEL TUTOR
  const proyectos = await Proyecto.findAll({});
  let proyects = await Promise.all(proyectos);

  //BUSCO TODAS LAS MATERIAS DE ESA CARRERA PARA FILTRAR LOS PROYECTOS
  const materias = await Materia.findAll({
    where: {
      idCarrera: req.params.idCarrera,
    },
  });

  let mat = await Promise.all(materias);
  let proyectosResponse = [];
  if (proyects.length > 0) {
    proyects.forEach((proyect) => {
      let mate = mat.find((m) => m.id === proyect.idMateria);
      if (mate) {
        proyectosResponse.push(proyect);
      }
      mate = null;
    });
    res.json({ proyectosResponse });
  } else {
    res
      .status(404)
      .json({ message: `No se encontró ningun proyecto para la carrera` });
  }
};

export const update = async (req, res) => {
  try {
    if (
      req.body.nombre !== undefined &&
      req.body.descripcion !== undefined &&
      req.body.idMateria !== undefined &&
      req.body.idTutor !== undefined &&
      req.body.fechaInicio !== undefined &&
      req.body.fechaFin !== undefined &&
      req.body.alumnos !== undefined
    ) {
      const proyecto = await Proyecto.findByPk(req.params.id);
      (proyecto.nombre = req.body.nombre),
        (proyecto.descripcion = req.body.descripcion),
        (proyecto.idMateria = req.body.idMateria),
        (proyecto.idTutor = req.body.idTutor),
        (proyecto.fechaInicio = req.body.fechaInicio),
        (proyecto.fechaFin = req.body.fechaFin),
        await proyecto.save();
      //ELIMINO TODOS LOS ALUMNOS ASOCIADOS A EL PROYECTO PARA ACTUALIZAR CON LOS
      //NUEVOS RECIBIDOS
      console.log('LLEGA');
      const alumnosProyecto = await AlumnoProyecto.findAll({
        where: {
          idProyecto: req.params.id,
        },
      });
      console.log('LLEGA 2');

      alumnosProyecto.map(async (AlumnoProyecto) => {
        await AlumnoProyecto.destroy();
      });
      console.log('LLEGA 3');
      //VUELVO A CARGAR LOS ALUMNOS RECIBIDOS AL PROYECTO
      req.body.alumnos.map(async (alumno) => {
        //CONTROLO QUE NO EXISTA UN USUARIO IGUAL EN EL PROYECTO
        const aluproyect = await AlumnoProyecto.findAll({
          where: {
            idProyecto: req.params.id,
            idAlumno: alumno.idAlumno,
          },
        });
        if (aluproyect.length === 0) {
          await AlumnoProyecto.create({
            idProyecto: req.params.id,
            idAlumno: alumno.idAlumno,
          });

          res.status(200).send({ id: proyecto.id });
        }
      });
    } else {
      if (req.body.nombre === undefined) {
        res.status(400).json('Nombre no recibido');
      } else if (req.body.descripcion === undefined) {
        res.status(400).json('Descripcion no recibida');
      } else if (req.body.idMateria === undefined) {
        res.status(400).json('Materia no recibida');
      } else if (req.body.idTutor === undefined) {
        res.status(400).json('Tutor no recibido');
      } else if (req.body.fechaInicio === undefined) {
        res.status(400).json('Fecha inicio de proyecto no recibida');
      } else if (req.body.fechaFin === undefined) {
        res.status(400).json('Fecha fin de proyecto no recibida');
      } else {
        res.status(400).json('No se recibio ningún alumno');
      }
    }
  } catch (err) {
    return res.status(500).send(err);
  }
};
export const ListProyectEstudiante = async (idAlumno) => {
  //BUSCO LOS PROYECTOS DEL ESTUDUANTE
  const aluProyectoAll = await AlumnoProyecto.findAll({
    where: {
      //proyectos.map((proyecto) => proyecto.toJSON());
      idAlumno: idAlumno,
    },
  });
  console.log(aluProyectoAll);
  //SI ENCUENTRO PROYECTOS DEL ALUMNO BUSCO LOS QUE ESTAN SIN CERRAR
  if (aluProyectoAll.length > 0) {
    const proyectos = await aluProyectoAll.map(
      async (alu) => await Proyecto.findByPk(alu.idProyecto)
    );
    let proyects = await Promise.all(proyectos);
    //BUSCO TODOS LOS TUTORES
    let tutores = await Usuario.findAll({
      where: {
        idRol: 2,
      },
    });
    proyects = proyects.map((proy) => proy.toJSON());
    tutores = tutores.map((tutor) => tutor.toJSON());
    //LISTO TODAS LAS MATERIAS
    let materias = await Materia.findAll({});
    materias = materias.map((materia) => materia.toJSON());

    proyects.forEach((proyect) => {
      if (proyect.fechaFin != null) {
        const mat = materias.find((m) => m.id === proyect.idMateria);
        proyect.materia = mat;
        console.log(mat);
        const tut = tutores.find((t) => t.id === proyect.idTutor);
        proyect.tutor = tut;
        console.log(tut);
      }
    });

    return proyects;
  } else {
    return [];
  }
};

export const create = async (req, res) => {
  try {
    console.log("Llega al create");
    if (
      req.body.nombre !== undefined &&
      req.body.descripcion !== undefined &&
      req.body.idMateria !== undefined &&
      req.body.idTutor !== undefined &&
      req.body.fechaInicio !== undefined &&
      req.body.alumnos !== undefined
    ) {
           
      const proyecto = await Proyecto.create({
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        idMateria: req.body.idMateria,
        idTutor: req.body.idTutor,
        fechaInicio: req.body.fechaInicio,
      });
      console.log("crea el proyecto");
      req.body.alumnos.map(async (alumno) => {
        await AlumnoProyecto.create({
          idProyecto: proyecto.id,
          idAlumno: alumno.idAlumno,
        });
      });
      console.log()
      //BUSCO LOS ALUMNOS PARA ENVIAR UN MAL
      const alumnosProy = await req.body.alumnos.map(
        async (alu) => await Usuario.findByPk(alu.idAlumno)
      );
      const alusproy = await Promise.all(alumnosProy);
      console.log(alusproy);
      const alumnosProyect = alusproy.map(
        async (alumn) => {
          await sendMailAltaProyecto({
            destinatario: alumn.email,
            asunto: altaProyecto,
            nombreUsuario: `${alumn.nombre} ${alumn.apellido}`,
            nombreProyecto: req.body.nombre,
            
            
          });
        }
      );
      const sendingMail = await Promise.all(alumnosProyect);
      res.status(200).send({ id: proyecto.id });
    } else {
      if (req.body.nombre === undefined) {
        res.status(400).json('Nombre no recibido');
      } else if (req.body.descripcion === undefined) {
        res.status(400).json('Descripcion no recibida');
      } else if (req.body.idMateria === undefined) {
        res.status(400).json('Materia no recibida');
      } else if (req.body.idTutor === undefined) {
        res.status(400).json('Tutor no recibido');
      } else if (req.body.fechaInicio === undefined) {
        res.status(400).json('Fecha inicio de proyecto no recibida');
      } else {
        res.status(400).json('No se recibio ningún alumno');
      }
    }
  } catch (err) {
    return res.status(500).send(err);
  }
};

export const AddEstudentToProject = async (req, res) => {
  try {
    if (req.body.idProyecto !== undefined && req.body.idAlumno !== undefined) {
      const alu = await AlumnoProyecto.create({
        idProyecto: req.body.idProyecto,
        idAlumno: req.body.idAlumno,
      });
      const usuario = await Usuario.findByPk(req.body.id);
      const proyectAlu = await Proyecto.findByPk(req.body.id);
      await sendMailAltaProyecto({
        destinatario: usuario.email,
        asunto: altaProyecto,
        nombreUsuario: `${usuario.nombre} ${usuario.apellido}`,
        nombreProyecto: proyectAlu.nombre,
              
      });
      
      res.status(200).send({ id: alu.id });
    } else {
      if (req.body.idProyecto === undefined) {
        res.status(400).json('Id de proyecto no recibido');
      } else if (req.body.idAlumno === undefined) {
        res.status(400).json('Id de alumno no recibido');
      }
    }
  } catch (err) {
    return res.status(500).send(err);
  }
};

export const destroy = async (req, res) => {
  const proyecto = await Proyecto.findByPk(req.params.id);
  if (proyecto) {
    const hitos = await Hito.findAll({
      where: {
        idProyecto: proyecto.id,
      },
    });
    if (hitos.length === 0) {
      await proyecto.destroy();
      res.status(200).json({ message: `Proyecto eliminado correctamente.` });
    } else {
      res.status(404).json({
        message: `No se puede eliminar el proyecto porque existen hitos asociados.`,
      });
    }
  } else {
    res.status(404).json({
      message: `No se encontró un proyecto con id ${req.params.id}`,
    });
  }
};
