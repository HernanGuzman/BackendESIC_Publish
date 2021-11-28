import Usuario from '../models/usuario';
import Carrera from '../models/carrera';
import Rol from '../models/rol';
import Proyecto from '../models/proyecto';
import AlumnoProyecto from '../models/alumnoproyecto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { sendMail, sendMailRecuperarPass } from '../helpers/mail_sender';
import { generarPass } from '../helpers/createPass';
import { asuntoRegistro, asuntoRecuperarContrasenia} from '../config/mail_sender';
import { BCRYPT_ROUNDS, JWT_DURACION, JWT_SECRET } from '../config';

export const index = async (req, res) => {
  const usuarios = await Usuario.findAll({});
  res.json({ data: usuarios.map((usuario) => usuario.toJSON()) });
};

export const saludo = async (req, res) => {
  console.log("LLEga a saludo");
  res.json({ data:"Hola como te va" });
};

export const ListByRol = async (req, res) => {
  const usuarios = await Usuario.findAll({
    where: {
      idRol: req.params.idRol,
    },
  });
  res.json({ data: usuarios.map((usuario) => usuario.toJSON()) });
};

export const ListEstudiantes = async (req, res) => {
  const usuarios = await Usuario.findAll({
    where: {
      idRol: req.params.idRol,
    },
  });
  const estudents = usuarios.map((usu) => usu.toJSON());
  console.log(estudents);
  let estudiantesDisponibles = [];

  const estudiantesConSusProyectos = await Promise.all(
    estudents.map(async (est) => {
      const idsProyectosDelEstudiante = await AlumnoProyecto.findAll({
        where: {
          idAlumno: est.id,
        },
      });
      const proyectosDelEstudiante = await Promise.all(
        idsProyectosDelEstudiante.map(
          async (alu) => await Proyecto.findByPk(alu.idProyecto)
        )
      );
      return { estudiante: est, proyectos: proyectosDelEstudiante };
    })
  );

  estudiantesConSusProyectos.forEach((est) => {
    let estado = true;
    const { estudiante, proyectos } = est;

    proyectos.forEach((proyect) => {
      if (proyect != null) {
        if (proyect.fechaFin == null) {
          estado = false;
        }
      }
    });
    if (estado) {
      estudiantesDisponibles.push(estudiante);
    }
    /* 
          alguno de los proyectos tiene fechaFin == null 
          acá los proyectos ya te los trajiste de la base, no necesitás ningún await
      */
  });
  console.log(estudiantesDisponibles.length);

  res.json({ data: estudiantesDisponibles });
};

export const show = async (req, res) => {
  const usuario = await Usuario.findByPk(req.params.id);
  if (usuario) {
    const carrera = await Carrera.findByPk(usuario.idCarrera);
    const rol = await Rol.findByPk(usuario.idRol);
    res.json({ usuario, carrera, rol });
  } else {
    res
      .status(404)
      .json({ message: `No se encontró un usuario con id ${req.params.id}` });
  }
};

export const recuperarContrasenia = async (req, res) => {
  const usuario = await Usuario.findOne({
    where: {
      dni: req.body.dni,
    },
  });
  if (usuario) {
    const passGenerada = generarPass();
    const contraseniaEncriptada = await encriptar(passGenerada);
    usuario.pass = contraseniaEncriptada;
    await usuario.save();
    await sendMailRecuperarPass({
      destinatario: usuario.email,
      asunto: asuntoRecuperarContrasenia,
      nombreUsuario: `${usuario.nombre} ${usuario.apellido}`,
      passNueva: passGenerada,
      
    });
    res.status(200).send({ message:`Password actualizada correctamente para el usuario: ${req.params.id}`});
  } else {
    res
      .status(404)
      .json({ message: `No se encontró un usuario con id ${usuario.id}` });
  }
};

export const cambiarContrasenia = async (req, res) => {
  const usuario = await Usuario.findByPk(req.body.id);
  if (usuario) {
   if(bcrypt.compareSync(req.body.contraseniaActual, usuario.pass)){
      const contraseniaEncriptada = await encriptar(req.body.contraseniaNueva);
      usuario.pass = contraseniaEncriptada;
      await usuario.save();
   }
       
    res.status(200).send({ message:`Password actualizada correctamente para el usuario: ${usuario.id}`});
  } else {
    res
      .status(404)
      .json({ message: `No se encontró un usuario con id ${req.params.id}` });
  }
};

export const update = async (req, res) => {
  try {
    if (
      req.body.nombre !== undefined &&
      req.body.apellido !== undefined &&
      req.body.dni !== undefined &&
      req.body.email !== undefined &&
      req.body.idRol !== undefined &&
      req.body.idCarrera !== undefined
    ) {
      const usuario = await Usuario.findByPk(req.params.id);
      //sino se mando contraseña modifico la existente sino queda la que esta guardada
      if (req.body.pass !== undefined) {
        const contraseniaEncriptada = await encriptar(req.body.pass);
        usuario.pass = contraseniaEncriptada;
      }
      usuario.nombre = req.body.nombre;
      usuario.apellido = req.body.apellido;
      usuario.dni = req.body.dni;
      usuario.email = req.body.email;
      usuario.idRol = req.body.idRol;
      usuario.idCarrera = req.body.idCarrera;
      await usuario.save();
      res.status(200).send({ id: usuario.id });
    } else {
      if (req.body.nombre === undefined) {
        res.status(400).json('Nombre no recibido');
      } else if (req.body.apellido === undefined) {
        res.status(400).json('Apellido no recibido');
      } else if (req.body.dni === undefined) {
        res.status(400).json('DNI no recibido');
      } else if (req.body.email === undefined) {
        res.status(400).json('Email no recibido');
      } else if (req.body.pass === undefined) {
        res.status(400).json('Password no recibido');
      } else if (req.body.idCarrera === undefined) {
        res.status(400).json('Id de Carrera no recibido');
      } else {
        res.status(400).json('Id de Rol no recibido');
      }
    }
  } catch (err) {
    return res.status(500).send(err);
  }
};

export const create = async (req, res) => {
  try {
    if (
      req.body.nombre !== undefined &&
      req.body.apellido !== undefined &&
      req.body.dni !== undefined &&
      req.body.email !== undefined &&
      req.body.pass !== undefined &&
      req.body.idRol !== undefined &&
      req.body.idCarrera !== undefined
    ) {
      //VALIDO QUE EL ESTUDIANTE NO ESTE INSCRIPTO EN LA CARRERA
      const usuarioExistente = await Usuario.findAll({
        where: {
          idCarrera: req.body.idCarrera,
          dni: req.body.dni,
        },
      });
      const usuarioExistenteEmail = [];
      /*
      const usuarioExistenteEmail = await Usuario.findAll({
        where: {
          email: req.body.email,
        },
      });
*/
      if (usuarioExistente.length > 0) {
        res.status(400).json('El usuario ya existe en la carrera');
      } else if (usuarioExistenteEmail.length > 0) {
        res
          .status(400)
          .json('El email ya se encuentra registrado en el sistema');
      } else {
        const contraseniaEncriptada = await encriptar(req.body.pass);
        const usuario = await Usuario.create({
          nombre: req.body.nombre,
          apellido: req.body.apellido,
          dni: req.body.dni,
          email: req.body.email,
          pass: contraseniaEncriptada,
          idRol: req.body.idRol,
          idCarrera: req.body.idCarrera,
        });
        
        //ENVIO DEL MAIL
        await sendMail({
          destinatario: usuario.email,
          asunto: asuntoRegistro,
          nombreUsuario: `${usuario.nombre} ${usuario.apellido}`,
          
        });
        res.status(200).send({ id: usuario.id });
      }
    } else {
      if (req.body.nombre === undefined) {
        res.status(400).json('Nombre no recibido');
      } else if (req.body.apellido === undefined) {
        res.status(400).json('Apellido no recibido');
      } else if (req.body.dni === undefined) {
        res.status(400).json('DNI no recibido');
      } else if (req.body.email === undefined) {
        res.status(400).json('Email no recibido');
      } else if (req.body.pass === undefined) {
        res.status(400).json('Password no recibido');
      } else if (req.body.idCarrera === undefined) {
        res.status(400).json('Id de Carrera no recibido');
      } else {
        res.status(400).json('Id de Rol no recibido');
      }
    }
  } catch (err) {
    return res.status(500).send(err);
  }
};

export const destroy = async (req, res) => {
  const usuario = await Usuario.findByPk(req.params.id);
  if (usuario) {
    //BUSCO QUE EL USUARIO QUE SE DESEA ELIMINAR NO SEA UN TUTOR ASOCIADO A UN PROYECTO
    const proyectosTutor = await Proyecto.findAll({
      where: {
        idTutor: usuario.id,
      },
    });

    const proyectosAlumno = await AlumnoProyecto.findAll({
      where: {
        idAlumno: usuario.id,
      },
    });

    if (proyectosTutor.length === 0 && proyectosAlumno.length === 0) {
      await usuario.destroy();
      res.status(200).json({ message: `Usuario eliminado correctamente.` });
    } else {
      if (proyectosTutor.length > 0) {
        res.status(404).json({
          message: `No se puede eliminar el tutor porque esta asociado a un proyecto.`,
        });
      } else {
        res.status(404).json({
          message: `No se puede eliminar el alumno porque esta asociado a un proyecto.`,
        });
      }
    }
  } else {
    res.status(404).json({
      message: `No se encontró un usuario con id ${req.params.id}`,
    });
  }
};

const encriptar = (contrasenia) => bcrypt.hashSync(
  contrasenia,
  bcrypt.genSaltSync()
);

const generarJWT = (usuario) =>
  jwt.sign(
    { id: usuario.id, correoElectronico: usuario.correoElectronico },
    JWT_SECRET,
    { expiresIn: JWT_DURACION }
  );

export const login = async (req, res) => {
  console.log("LLega al login");
  const usuario = await Usuario.conCorreoYContrasenia(
    req.body.dni,
    req.body.pass
  );

  if (!usuario) {
    return res
      .status(401)
      .json({ mensaje: 'Ups, no encontramos a nadie con esas credenciales' });
  }
  usuario.pass = '';
  res.status(200).json({
    data: { ...usuario.toJSON(), token: await generarJWT(usuario) },
  });
};
