import { Model, DataTypes } from 'sequelize';
export default class AlumnoProyecto extends Model {
    static init(sequelize) {
        return super.init(
            {
                idProyecto: DataTypes.INTEGER,
                idAlumno: DataTypes.INTEGER,
            },
            {
                sequelize,
                modelName: 'AlumnoProyecto',
            }
        );
    }
}
