module.exports = (sequelize, Sequelize) => {
  const Catedratico = sequelize.define('catedratico', {
    id_catedratico: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_usuario: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    especialidad: {
      type: Sequelize.STRING(150),
      allowNull: false
    },
    horario: {
      type: Sequelize.STRING(100), // ej. "Lun-Vie 7:00-12:00"
      allowNull: false
    }
  }, {
    tableName: 'catedraticos',
    underscored: true
  });

  return Catedratico;
};
