import { Model, DataTypes } from 'sequelize';

export default class TipoHito extends Model {
    static init(sequelize) {
        return super.init(
            {
                nombre: DataTypes.STRING,
            },
            {
                sequelize,
                modelName: 'TipoHito',
            }
        );
    }
}