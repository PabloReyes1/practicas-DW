module.exports = (sequelize, Sequelize) => {
    const Prueba = sequelize.define('prueba', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      }
    });
  
    return Prueba;
  }
  