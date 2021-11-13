import { Model, DataTypes } from 'sequelize';

export default class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        nombre: DataTypes.STRING,
        apellido: DataTypes.STRING,
        dni: DataTypes.STRING,
        email: DataTypes.STRING,
        pass: DataTypes.STRING,
        idRol: DataTypes.INTEGER,
      },
      {
        sequelize,
        modelName: 'User',
      }
    );
  }
}
