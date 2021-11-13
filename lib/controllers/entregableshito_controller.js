import EntregablesHito from '../models/entregableshito';

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
