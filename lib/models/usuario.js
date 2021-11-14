import { Model, DataTypes } from 'sequelize';
import { omit } from 'ramda';
import bcrypt from 'bcryptjs';
import { generarJWT } from '../helpers/jwt';

export default class Usuario extends Model {
  static init(sequelize) {
    return super.init(
      {
        nombre: DataTypes.STRING,
        apellido: DataTypes.STRING,
        dni: DataTypes.STRING,
        email: DataTypes.STRING,
        pass: DataTypes.STRING,
        idRol: DataTypes.INTEGER,
        idCarrera: DataTypes.INTEGER,
        tokenTemporal: DataTypes.STRING,
      },
      {
        sequelize,
        modelName: 'Usuario',
      }
    );
  }

  static async conCorreoYContrasenia(dniUsuario, contrasenia) {
    const usuario = await this.findOne({
      where: {
        dni: dniUsuario,
      },
    });

    if (!usuario) {
      return null;
    }
    
    
    const contraseniaValida = await bcrypt.compareSync(contrasenia, usuario.pass);

    

    return contraseniaValida ? usuario : null;
  }
  // Sobreescribimos este método para que no llegue la contraseña al cliente
  toJSON() {
    return omit(['contraseniaEncriptada'], super.toJSON());
  }

  async generarYGuardarTokenTemporal() {
    const tokenTemporal = generarJWT(this.id, this.dni, '15m');
    await this.update({ tokenTemporal });
    return tokenTemporal;
  }
}
