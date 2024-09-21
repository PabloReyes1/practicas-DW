module.exports = (sequelize, Sequelize) => {
    const Usuario = sequelize.define('usuario', {
      id_usuario: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      apellidos: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      telefono: {
        type: Sequelize.INTEGER
      },
      direccion: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      estado: {
        type: Sequelize.STRING(20),
        allowNull: false,
        validate: {
          isIn: [['activo', 'inactivo', 'suspendido']]
        }
      }
    });
  
    return Usuario;
  };
  