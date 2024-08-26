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
      password: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      numero_telefono: {
        type: Sequelize.STRING(15)
      },
      rol: {
        type: Sequelize.STRING(20),
        allowNull: false,
        validate: {
          isIn: [['cliente', 'admin']]
        }
      }
    });
  
    return Usuario;
  };
  