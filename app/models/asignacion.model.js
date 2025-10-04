// app/models/asignacion.model.js
module.exports = (sequelize, Sequelize) => {
  const Asignacion = sequelize.define('asignacion', {
    id_asignacion: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_alumno: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    id_curso: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    id_catedratico: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    ciclo: {
      type: Sequelize.STRING(20), // p.ej. "I", "II", "2025-1", etc.
      allowNull: false
    },
    anio: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: { min: 1900 }
    }
  }, {
    tableName: 'asignaciones',
    underscored: true,
    indexes: [
      // Evita duplicados de la misma asignación en un ciclo/año
      {
        unique: true,
        fields: ['id_alumno', 'id_curso', 'id_catedratico', 'ciclo', 'anio']
      }
    ]
  });

  return Asignacion;
};
