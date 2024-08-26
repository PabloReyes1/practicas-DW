module.exports = (sequelize, Sequelize) => {
    const Cita = sequelize.define('cita', {
      id_cita: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id_mascota: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'mascotas', // nombre de la tabla referenciada
          key: 'id_mascota'
        },
        onDelete: 'CASCADE'
      },
      id_servicio: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'servicios', // nombre de la tabla referenciada
          key: 'id_servicio'
        },
        onDelete: 'CASCADE'
      },
      fecha: {
        type: Sequelize.DATE,
        allowNull: false
      },
      estado: {
        type: Sequelize.STRING(20),
        allowNull: false,
        validate: {
          isIn: [['pendiente', 'confirmada', 'cancelada']]
        }
      }
    });
  
    return Cita;
  };
  