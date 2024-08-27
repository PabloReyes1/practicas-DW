module.exports = (sequelize, Sequelize) => {
    const Reserva = sequelize.define('reserva', {
      id_reserva: {
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
      fecha_inicio: {
        type: Sequelize.DATE,
        allowNull: false
      },
      fecha_fin: {
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
  
    return Reserva;
  };
  