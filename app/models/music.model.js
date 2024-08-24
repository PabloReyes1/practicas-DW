module.exports = (sequelize, Sequelize) => {
    const Music = sequelize.define('music', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      nombre: {
        type: Sequelize.STRING
      },
      descripcion: {
        type: Sequelize.STRING
      },
      artista: {
        type: Sequelize.STRING
      },
      duracion: {
        type: Sequelize.INTEGER
      },
      extencion: {
        type: Sequelize.STRING
      },
      album: {
        type: Sequelize.STRING
      },
      year: {
        type: Sequelize.INTEGER
      }
    });
  
    return Music;
  }
  