const db = require('../config/db.config.js');
const Libro = db.Libro;

exports.create = (req, res) => {
  let libro = {};

  try {
    libro.nombre_libro = req.body.nombre_libro;
    libro.editorial = req.body.editorial;
    libro.autor = req.body.autor;
    libro.genero = req.body.genero;
    libro.pais_autor = req.body.pais_autor;
    libro.numero_paginas = req.body.numero_paginas;
    libro.año_edicion = req.body.año_edicion;
    libro.precio_libro = req.body.precio_libro;

    Libro.create(libro).then(result => {
      res.status(200).json({
        message: "Libro creado con éxito con el id = " + result.codigo_libro,
        libro: result,
      });
    });
  } catch (error) {
    res.status(500).json({
      message: "Error!",
      error: error.message
    });
  }
};

exports.retrieveAllLibros = (req, res) => {
  Libro.findAll()
    .then(libros => {
      res.status(200).json({
        message: "Operación de recuperación completada!",
        libros: libros
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

exports.getLibroById = (req, res) => {
  let libroId = req.params.id;
  Libro.findByPk(libroId)
    .then(libro => {
      res.status(200).json({
        message: "Libro obtenido con id = " + libroId,
        libro: libro
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
    let libroId = req.params.id;
    let libro = await Libro.findByPk(libroId);

    if (!libro) {
      res.status(404).json({
        message: "No se encontró libro para actualizar con id = " + libroId,
        libro: "",
        error: "404"
      });
    } else {
      let updatedObject = {
        nombre_libro: req.body.nombre_libro,
        editorial: req.body.editorial,
        autor: req.body.autor,
        genero: req.body.genero,
        pais_autor: req.body.pais_autor,
        numero_paginas: req.body.numero_paginas,
        año_edicion: req.body.año_edicion,
        precio_libro: req.body.precio_libro
      };
      let result = await Libro.update(updatedObject, { returning: true, where: { codigo_libro: libroId } });

      if (!result) {
        res.status(500).json({
          message: "Error -> No se puede actualizar el libro con id = " + req.params.id,
          error: "NO SE PUEDE ACTUALIZAR!!",
        });
      }

      res.status(200).json({
        message: "Actualización completa del libro con id = " + libroId,
        libro: updatedObject,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error -> No se puede actualizar el libro con id = " + req.params.id,
      error: error.message
    });
  }
};

exports.deleteById = async (req, res) => {
  try {
    let libroId = req.params.id;
    let libro = await Libro.findByPk(libroId);

    if (!libro) {
      res.status(404).json({
        message: "No existe un libro con id = " + libroId,
        error: "404",
      });
    } else {
      await libro.destroy();
      res.status(200).json({
        message: "Libro borrado con éxito con id = " + libroId,
        libro: libro,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error -> No se pudo borrar el libro con id = " + req.params.id,
      error: error.message,
    });
  }
};
