import Materia from '../models/materia';
import Proyecto from '../models/proyecto';

export const index = async (req, res) => {
  const materias = await Materia.findAll({});
  res.json({ data: materias.map((materia) => materia.toJSON()) });
};

export const ListByCarrera = async (req, res) => {
  const materias = await Materia.findAll({
    where: {
      idCarrera: req.params.id,
    },
  });
  res.json({ data: materias.map((materia) => materia.toJSON()) });
};

export const show = async (req, res) => {
  const materia = await Materia.findByPk(req.params.id);
  if (materia) {
    res.json({ data: materia.toJSON() });
  } else {
    res
      .status(404)
      .json({ message: `No se encontró una materia con id ${req.params.id}` });
  }
};

export const update = async (req, res) => {
  try {
    console.log(req.body.idCarrera);
    if (req.body.nombre !== undefined && req.body.idCarrera !== undefined) {
      const materia = await Materia.findByPk(req.params.id);
      materia.nombre = req.body.nombre;
      materia.idCarrera = req.body.idCarrera;
      await materia.save();
      res.status(200).send({ id: materia.id });
    } else {
      if (req.body.nombre === undefined) {
        res.status(400).json('Nombre no recibido');
      } else {
        res.status(400).json('Id de carrera no recibido');
      }
    }
  } catch (err) {
    return res.status(500).send(err);
  }
};

export const create = async (req, res) => {
  try {
    if (req.body.nombre !== undefined && req.body.idCarrera !== undefined) {
      const materia = await Materia.create({
        nombre: req.body.nombre,
        idCarrera: req.body.idCarrera,
      });
      res.status(200).send({ id: materia.id });
    } else {
      if (req.body.nombre === undefined) {
        res.status(400).json('Nombre no recibido');
      } else {
        res.status(400).json('Id de carrera no recibido');
      }
    }
  } catch (err) {
    return res.status(500).send(err);
  }
};

export const destroy = async (req, res) => {
  const materia = await Materia.findByPk(req.params.id);
  if (materia) {
    const proyectos = await Proyecto.findAll({
      where: {
        idMateria: materia.id,
      },
    });
    if (proyectos.length === 0) {
      await materia.destroy();
      res.status(200).json({ message: `Materia eliminada correctamente.` });
    } else {
      res.status(404).json({
        message: `No se puede eliminar la materia porque existen proyectos asociados.`,
      });
    }
  } else {
    res
      .status(404)
      .json({ message: `No se encontró una materia con id ${req.params.id}` });
  }
};
