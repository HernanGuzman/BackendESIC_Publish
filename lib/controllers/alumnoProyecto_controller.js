import AlumnoProyecto from '../models/alumnoproyecto';

export const destroy = async (req, res) => {
  const alumnoProyect = await AlumnoProyecto.findOne({
    where: {
      idProyecto: req.params.idProyecto,
      idAlumno: req.params.idAlumno,
    },
  });
  if (alumnoProyect) {
    await alumnoProyect.destroy();
    res
      .status(200)
      .json({ message: `Alumno eliminado correctamente del proyecto.` });
  } else {
    res.status(404).json({
      message: `No se encontró el alumno con id ${req.params.idAlumno} el el proyecto con id ${req.params.idProyecto}`,
    });
  }
};

export const AlusProyect = async (idProyecto) => {
  console.log("Llega al alusProy");
  const alumnoProyect = await AlumnoProyecto.findAll({
    where: {
      idProyecto: idProyecto,
      
    },
  });
  return alumnoProyect;
  
};
