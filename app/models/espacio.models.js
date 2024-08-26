module.exports = (sequelize, Sequelize) => {
    const Espacio = sequelize.define('espacio', {
      id_espacio: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre_espacio: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      descripcion: {
        type: Sequelize.TEXT
      },
      capacidad: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      disponibilidad: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      fecha_creacion: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      fecha_actualizacion: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    }, {
      timestamps: false,
      hooks: {
        beforeUpdate: (espacio, options) => {
          espacio.fecha_actualizacion = new Date();
        }
      }
    });
  
    return Espacio;
  };
  