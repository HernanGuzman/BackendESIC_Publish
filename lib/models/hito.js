import { Model, DataTypes } from 'sequelize';

export default class Hito extends Model {
    static init(sequelize) {
        return super.init(
            {
                idProyecto: DataTypes.INTEGER,
                idTipo: DataTypes.INTEGER,
                descripcion: DataTypes.STRING,
                fechaEntrega: DataTypes.DATE,
                entregado: DataTypes.BOOLEAN,
            },
            {
                sequelize,
                modelName: 'Hito',
            }
        );
    }
}