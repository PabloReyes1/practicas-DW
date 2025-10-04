module.exports = (sequelize, Sequelize) => {
  const Usuario = sequelize.define('usuario', {
    id_usuario: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    apellido: {
      type: Sequelize.STRING(100),
      allowNull: false
    },
    email: {
      type: Sequelize.STRING(150),
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    contrasena: {
      type: Sequelize.STRING(255), // hash
      allowNull: false
    },
    rol: {
      type: Sequelize.STRING(20), // 'admin' | 'alumno' | 'catedratico'
      allowNull: false,
      validate: { isIn: [['admin', 'alumno', 'catedratico']] }
    }
  }, {
    tableName: 'usuarios',
    underscored: true
  });

  return Usuario;
};
