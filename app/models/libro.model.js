module.exports = (sequelize, Sequelize) => {
    const Libro = sequelize.define('libro', {
      codigo_libro: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre_libro: {
        type: Sequelize.STRING(60)
      },
      editorial: {
        type: Sequelize.STRING(25)
      },
      autor: {
        type: Sequelize.STRING(25)
      },
      genero: {
        type: Sequelize.STRING(20)
      },
      pais_autor: {
        type: Sequelize.STRING(20)
      },
      numero_paginas: {
        type: Sequelize.INTEGER
      },
      año_edicion: {
        type: Sequelize.DATE
      },
      precio_libro: {
        type: Sequelize.FLOAT
      }
    });
  
    return Libro;
  };
  