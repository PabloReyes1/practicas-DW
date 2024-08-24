// app/models/product.model.js
module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define('product', {
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
      },
      price: {
        type: Sequelize.FLOAT
      },
      stock: {
        type: Sequelize.INTEGER
      }
    });
  
    return Product;
  }
  