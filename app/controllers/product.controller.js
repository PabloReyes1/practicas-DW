// app/controllers/product.controller.js
const db = require('../config/db.config.js');
const Product = db.Product;

exports.create = (req, res) => {
  let product = {};

  try {
    product.name = req.body.name;
    product.description = req.body.description;
    product.price = req.body.price;
    product.stock = req.body.stock;

    Product.create(product).then(result => {
      res.status(200).json({
        message: "Uploaded Successfully a Product with id = " + result.id,
        product: result,
      });
    });
  } catch(error) {
    res.status(500).json({
      message: "Fail!",
      error: error.message
    });
  }
};

exports.retrieveAllProducts = (req, res) => {
  Product.findAll()
    .then(productInfos => {
      res.status(200).json({
        message: "Get all Products' Infos Successfully!",
        products: productInfos
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Error!",
        error: error
      });
    });
};

exports.getProductById = (req, res) => {
  let productId = req.params.id;
  Product.findByPk(productId)
    .then(product => {
      res.status(200).json({
        message: " Successfully Get a Product with id = " + productId,
        product: product
      });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: "Error!",
        error: error
      });
    });
};

exports.updateById = async (req, res) => {
  try {
    let productId = req.params.id;
    let product = await Product.findByPk(productId);

    if(!product){
      res.status(404).json({
        message: "Not Found for updating a product with id = " + productId,
        product: "",
        error: "404"
      });
    } else {    
      let updatedObject = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        stock: req.body.stock
      }
      let result = await Product.update(updatedObject, {returning: true, where: {id: productId}});
      
      if(!result) {
        res.status(500).json({
          message: "Error -> Can not update a product with id = " + req.params.id,
          error: "Can NOT Updated",
        });
      }

      res.status(200).json({
        message: "Update successfully a Product with id = " + productId,
        product: updatedObject,
      });
    }
  } catch(error){
    res.status(500).json({
      message: "Error -> Can not update a product with id = " + req.params.id,
      error: error.message
    });
  }
};

exports.deleteById = async (req, res) => {
  try {
    let productId = req.params.id;
    let product = await Product.findByPk(productId);

    if(!product){
      res.status(404).json({
        message: "Does Not exist a Product with id = " + productId,
        error: "404",
      });
    } else {
      await product.destroy();
      res.status(200).json({
        message: "Delete Successfully a Product with id = " + productId,
        product: product,
      });
    }
  } catch(error) {
    res.status(500).json({
      message: "Error -> Can NOT delete a product with id = " + req.params.id,
      error: error.message,
    });
  }
};
