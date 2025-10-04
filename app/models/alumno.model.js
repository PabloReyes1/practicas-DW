// app/models/alumno.model.js
module.exports = (sequelize, Sequelize) => {
  const Alumno = sequelize.define('alumno', {
    id_alumno: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_usuario: {
      type: Sequelize.INTEGER,
      allowNull: false
      // La FK y asociación se declaran en db.config.js
    },
    grado_carrera: {
      type: Sequelize.STRING(150),
      allowNull: false
    },
    matricula: {
      type: Sequelize.STRING(50),
      allowNull: false,
      unique: true
    },
    fecha_ingreso: {
      type: Sequelize.DATEONLY, // 'YYYY-MM-DD'
      allowNull: false,
      validate: {
        isDate: true
      }
    }
  }, {
    tableName: 'alumnos',
    underscored: true
  });

  return Alumno;
};
