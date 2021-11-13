import { Model, DataTypes } from 'sequelize';

export default class Proyecto extends Model {
  static init(sequelize) {
    return super.init(
      {
        nombre: DataTypes.STRING,
        descripcion: DataTypes.STRING,
        idMateria: DataTypes.INTEGER,
        idTutor: DataTypes.INTEGER,
        fechaInicio: DataTypes.DATE,
        fechaFin: DataTypes.DATE,
      },
      {
        sequelize,
        modelName: 'Proyecto',
      }
    );
  }
}
