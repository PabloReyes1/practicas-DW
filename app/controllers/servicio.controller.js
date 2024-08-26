const db = require('../config/db.config.js');
const Servicio = db.Servicio;

exports.create = (req, res) => {
  let servicio = {};

  try {
    servicio.nombre = req.body.nombre;
    servicio.descripcion = req.body.descripcion;
    servicio.precio = req.body.precio;

    Servicio.create(servicio).then(result => {
      res.status(200).json({
        message: "Servicio creado con éxito con id = " + result.id_servicio,
        servicio: result,
      });
    });
  } catch (error) {
    res.status(500).json({
      message: "Error!",
      error: error.message
    });
  }
};

exports.retrieveAllServicios = (req, res) => {
  Servicio.findAll()
    .then(servicios => {
      res.status(200).json({
        message: "Operación de recuperación completada!",
        servicios: servicios
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

exports.getServicioById = (req, res) => {
  let servicioId = req.params.id;
  Servicio.findByPk(servicioId)
    .then(servicio => {
      res.status(200).json({
        message: "Servicio obtenido con id = " + servicioId,
        servicio: servicio
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
    let servicioId = req.params.id;
    let servicio = await Servicio.findByPk(servicioId);

    if (!servicio) {
      res.status(404).json({
        message: "No se encontró servicio para actualizar con id = " + servicioId,
        servicio: "",
        error: "404"
      });
    } else {
      let updatedObject = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        precio: req.body.precio
      };
      let result = await Servicio.update(updatedObject, { returning: true, where: { id_servicio: servicioId } });

      if (!result) {
        res.status(500).json({
          message: "Error -> No se puede actualizar el servicio con id = " + req.params.id,
          error: "NO SE PUEDE ACTUALIZAR!!",
        });
      }

      res.status(200).json({
        message: "Actualización completa del servicio con id = " + servicioId,
        servicio: updatedObject,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error -> No se puede actualizar el servicio con id = " + req.params.id,
      error: error.message
    });
  }
};

exports.deleteById = async (req, res) => {
  try {
    let servicioId = req.params.id;
    let servicio = await Servicio.findByPk(servicioId);

    if (!servicio) {
      res.status(404).json({
        message: "No existe un servicio con id = " + servicioId,
        error: "404",
      });
    } else {
      await servicio.destroy();
      res.status(200).json({
        message: "Servicio borrado con éxito con id = " + servicioId,
        servicio: servicio,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error -> No se pudo borrar el servicio con id = " + req.params.id,
      error: error.message,
    });
  }
};
