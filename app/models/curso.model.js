// app/models/curso.model.js
module.exports = (sequelize, Sequelize) => {
  const Curso = sequelize.define('curso', {
    id_curso: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: Sequelize.STRING(150),
      allowNull: false
    },
    descripcion: {
      type: Sequelize.TEXT,       // opcional según ER
      allowNull: true
    },
    grado_carrera: {
      type: Sequelize.STRING(150),
      allowNull: false
    }
  }, {
    tableName: 'cursos',
    underscored: true
  });

  return Curso;
};
