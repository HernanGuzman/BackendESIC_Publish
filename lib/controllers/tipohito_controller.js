import TipoHito from '../models/tipohito';
import Hito from '../models/hito';

export const index = async (req, res) => {
  const tipoHitos = await TipoHito.findAll({});
  res.json({ data: tipoHitos.map((tipo) => tipo.toJSON()) });
};

export const show = async (req, res) => {
  const tipo = await TipoHito.findByPk(req.params.id);
  if (tipo) {
    res.json({ data: tipo.toJSON() });
  } else {
    res.status(404).json({
      message: `No se encontró un tipo de hito con id ${req.params.id}`,
    });
  }
};

export const update = async (req, res) => {
  try {
    if (req.body.nombre !== undefined) {
      const tipo = await TipoHito.findByPk(req.params.id);
      tipo.nombre = req.body.nombre;
      await tipo.save();
      res.status(200).send({ id: tipo.id });
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
      const tipo = await TipoHito.create({ nombre: req.body.nombre });
      res.status(200).send({ id: tipo.id });
    } else {
      res.status(400).json('Nombre no recibido');
    }
  } catch (err) {
    return res.status(500).send(err);
  }
};

export const destroy = async (req, res) => {
  const tipo = await TipoHito.findByPk(req.params.id);
  if (tipo) {
    const hitos = await Hito.findAll({
      where: {
        idTipo: tipo.id,
      },
    });
    if (hitos.length === 0) {
      await tipo.destroy();
      res
        .status(200)
        .json({ message: `Tipo de Hito eliminado correctamente.` });
    } else {
      res.status(404).json({
        message: `No se puede eliminar el tipo de Hito porque existen Hitos asociados.`,
      });
    }
  } else {
    res.status(404).json({
      message: `No se encontró un tipo de hito con id ${req.params.id}`,
    });
  }
};

export const saludo = async (req, res) => {
  console.log("LLEga a saludo");
  res.json({ data:"Hola como te va" });
};
