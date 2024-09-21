module.exports = (sequelize, Sequelize) => {
    const Libro = sequelize.define('libro', {
      codigo_libro: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      titulo: {
        type: Sequelize.STRING(60)
      },
      id_autor: {
        type: Sequelize.INTEGER
      },
      isbn: {
        type: Sequelize.STRING(25)
      },
      editorial: {
        type: Sequelize.STRING(25)
      },
      año_publicacion: {
        type: Sequelize.DATE
      },
      categoria: {
        type: Sequelize.STRING(20)
      },
      cantidad_disponible: {
        type: Sequelize.INTEGER
      },
      ubicacion: {
        type: Sequelize.STRING(20)
      },
    });
  
    return Libro;
  };
  