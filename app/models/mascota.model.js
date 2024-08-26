module.exports = (sequelize, Sequelize) => {
    const Mascota = sequelize.define('mascota', {
      id_mascota: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'usuarios', // nombre de la tabla referenciada
          key: 'id_usuario'
        },
        onDelete: 'CASCADE'
      },
      nombre: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      raza: {
        type: Sequelize.STRING(50)
      },
      edad: {
        type: Sequelize.INTEGER
      },
      necesidades_especiales: {
        type: Sequelize.TEXT
      }
    });
  
    return Mascota;
  };
  