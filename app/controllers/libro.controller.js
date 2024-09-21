const db = require('../config/db.config.js');
const Libro = db.Libro;

exports.create = (req, res) => {
  let libro = {};

  try {
    libro.titulo = req.body.titulo;
    libro.id_autor = req.body.id_autor;
    libro.isbn = req.body.isbn;
    libro.editorial = req.body.editorial;
    libro.año_publicacion = req.body.año_publicacion;
    libro.categoria = req.body.categoria;
    libro.cantidad_disponible = req.body.cantidad_disponible;
    libro.ubicacion = req.body.ubicacion;

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
        titulo: req.body.titulo,
        id_autor: req.body.id_autor,
        isbn: req.body.isbn,
        editorial: req.body.editorial,
        año_publicacion: req.body.año_publicacion,
        categoria: req.body.categoria,
        cantidad_disponible: req.body.cantidad_disponible,
        ubicacion: req.body.ubicacion
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
