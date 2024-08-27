module.exports = (sequelize, Sequelize) => {
  const ReservaEspacio = sequelize.define('reserva_espacio', {
    id_reserva_espacio: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_reserva: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'reservas',
        key: 'id_reserva'
      },
      onDelete: 'CASCADE'
    },
    id_espacio: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'espacios',
        key: 'id_espacio'
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
    }
  });

  return ReservaEspacio;
};
