// app/models/nota.model.js
module.exports = (sequelize, Sequelize) => {
  const Nota = sequelize.define('nota', {
    id_nota: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_asignacion: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    etiqueta: {
      // Ej: "Parcial 1", "Tarea 2", "Examen Final"
      type: Sequelize.STRING(100),
      allowNull: false
    },
    ponderacion: {
      // Porcentaje que aporta al curso: [0..100]
      type: Sequelize.DECIMAL(5,2),
      allowNull: false,
      validate: { min: 0, max: 100 }
    },
    nota: {
      // Calificación obtenida: [0..100]
      type: Sequelize.DECIMAL(5,2),
      allowNull: false,
      validate: { min: 0, max: 100 }
    },
    fecha_registro: {
      type: Sequelize.DATEONLY, // 'YYYY-MM-DD'
      allowNull: false
    },
    observaciones: {
      type: Sequelize.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'notas',
    underscored: true,
    indexes: [
      // Evita duplicar misma evaluación dentro de la misma asignación
      { unique: true, fields: ['id_asignacion', 'etiqueta'] }
    ]
  });

  return Nota;
};
