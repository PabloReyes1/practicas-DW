module.exports = (sequelize, Sequelize) => {
    const Servicio = sequelize.define('servicio', {
      id_servicio: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      descripcion: {
        type: Sequelize.TEXT
      },
      precio: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      }
    });
  
    return Servicio;
  };
  