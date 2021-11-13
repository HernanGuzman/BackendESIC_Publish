import Rol from '../models/rol';
import Usuario from '../models/usuario';

export const index = async (req, res) => {
  const roles = await Rol.findAll({});
  res.json({ data: roles.map((rol) => rol.toJSON()) });
};

export const show = async (req, res) => {
  const rol = await Rol.findByPk(req.params.id);
  if (rol) {
    res.json({ data: rol.toJSON() });
  } else {
    res
      .status(404)
      .json({ message: `No se encontró un rol con id ${req.params.id}` });
  }
};

export const destroy = async (req, res) => {
  const rol = await Rol.findByPk(req.params.id);
  if (rol) {
    const usuarios = await Usuario.findAll({
      where: {
        idRol: rol.id,
      },
    });
    if (usuarios.length === 0) {
      await rol.destroy();
      res.status(200).json({ message: `Rol eliminado correctamente.` });
    } else {
      res.status(404).json({
        message: `No se puede eliminar el rol porque existen usuarios asociados.`,
      });
    }
  } else {
    res
      .status(404)
      .json({ message: `No se encontró un rol con id ${req.params.id}` });
  }
};

export const update = async (req, res) => {
  try {
    if (req.body.nombre !== undefined) {
      const rol = await Rol.findByPk(req.params.id);
      rol.nombre = req.body.nombre;
      await rol.save();
      res.status(200).send({ id: rol.id });
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
      const rol = await Rol.create({ nombre: req.body.nombre });
      res.status(200).send({ id: rol.id });
    } else {
      res.status(400).json('Nombre no recibido');
    }
  } catch (err) {
    return res.status(500).send(err);
  }
};
