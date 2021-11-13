import { Model, DataTypes } from 'sequelize';

export default class EntregablesHito extends Model {
  static init(sequelize) {
    return super.init(
      {
        idHito: DataTypes.INTEGER,
        numVersion: DataTypes.INTEGER,
        entrega: DataTypes.STRING,
        devolucion: DataTypes.STRING,
        documento: DataTypes.TEXT,
      },
      {
        sequelize,
        modelName: 'EntregablesHito',
      }
    );
  }
}
