import Carrera from '../models/carrera';
import Materia from '../models/materia';
import Usuario from '../models/usuario';

export const index = async (req, res) => {
  const carreras = await Carrera.findAll({});
  res.json({ data: carreras.map((carrera) => carrera.toJSON()) });
};

export const show = async (req, res) => {
  const carrera = await Carrera.findByPk(req.params.id);
  if (carrera) {
    res.json({ data: carrera.toJSON() });
  } else {
    res
      .status(404)
      .json({ message: `No se encontró una carrera con id ${req.params.id}` });
  }
};

export const update = async (req, res) => {
  try {
    if (req.body.nombre !== undefined) {
      const carrera = await Carrera.findByPk(req.params.id);
      carrera.nombre = req.body.nombre;
      await carrera.save();
      res.status(200).send({ id: carrera.id });
    } else {
      res.status(400).json('Nombre no recibido');
    }
  } catch (err) {
    return res.status(500).send(err);
  }
};

export const create = async (req, res) => {
  try {
    if (req.body.nombre !== undefined) {
      const carrera = await Carrera.create({ nombre: req.body.nombre });
      res.status(200).send({ id: carrera.id });
    } else {
      res.status(400).json('Nombre no recibido');
    }
  } catch (err) {
    return res.status(500).send(err);
  }
};

export const destroyCarrera = async (req, res) => {
  const carrera = await Carrera.findByPk(req.params.id);
  if (carrera) {
    const materias = await Materia.findAll({
      where: {
        idCarrera: carrera.id,
      },
    });
    const usuarios = await Usuario.findAll({
      where: {
        idCarrera: carrera.id,
      },
    });
    if (materias.length === 0 && usuarios.length === 0) {
      await carrera.destroy();
      res.status(200).json({ message: `Carrera eliminada correctamente.` });
    } else {
      if (materias.length > 0) {
        res.status(404).json({
          message: `No se puede eliminar la carrera porque existen materias asociadas.`,
        });
      } else {
        res.status(404).json({
          message: `No se puede eliminar la carrera porque existen usuarios asociados.`,
        });
      }
    }
  } else {
    res
      .status(404)
      .json({ message: `No se encontró una carrera con id ${req.params.id}` });
  }
};
