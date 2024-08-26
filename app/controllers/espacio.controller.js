const db = require('../config/db.config.js');
const Espacio = db.Espacio;

exports.create = (req, res) => {
  let espacio = {};

  try {
    espacio.nombre_espacio = req.body.nombre_espacio;
    espacio.descripcion = req.body.descripcion;
    espacio.capacidad = req.body.capacidad;
    espacio.disponibilidad = req.body.disponibilidad;

    Espacio.create(espacio).then(result => {
      res.status(200).json({
        message: "Espacio creado con éxito con id = " + result.id_espacio,
        espacio: result,
      });
    });
  } catch (error) {
    res.status(500).json({
      message: "Error!",
      error: error.message
    });
  }
};

exports.retrieveAllEspacios = (req, res) => {
  Espacio.findAll()
    .then(espacios => {
      res.status(200).json({
        message: "Operación de recuperación completada!",
        espacios: espacios
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

exports.getEspacioById = (req, res) => {
  let espacioId = req.params.id;
  Espacio.findByPk(espacioId)
    .then(espacio => {
      res.status(200).json({
        message: "Espacio obtenido con id = " + espacioId,
        espacio: espacio
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
    let espacioId = req.params.id;
    let espacio = await Espacio.findByPk(espacioId);

    if (!espacio) {
      res.status(404).json({
        message: "No se encontró espacio para actualizar con id = " + espacioId,
        espacio: "",
        error: "404"
      });
    } else {
      let updatedObject = {
        nombre_espacio: req.body.nombre_espacio,
        descripcion: req.body.descripcion,
        capacidad: req.body.capacidad,
        disponibilidad: req.body.disponibilidad
      };
      let result = await Espacio.update(updatedObject, { returning: true, where: { id_espacio: espacioId } });

      if (!result) {
        res.status(500).json({
          message: "Error -> No se puede actualizar el espacio con id = " + req.params.id,
          error: "NO SE PUEDE ACTUALIZAR!!",
        });
      }

      res.status(200).json({
        message: "Actualización completa del espacio con id = " + espacioId,
        espacio: updatedObject,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error -> No se puede actualizar el espacio con id = " + req.params.id,
      error: error.message
    });
  }
};

exports.deleteById = async (req, res) => {
  try {
    let espacioId = req.params.id;
    let espacio = await Espacio.findByPk(espacioId);

    if (!espacio) {
      res.status(404).json({
        message: "No existe un espacio con id = " + espacioId,
        error: "404",
      });
    } else {
      await espacio.destroy();
      res.status(200).json({
        message: "Espacio borrado con éxito con id = " + espacioId,
        espacio: espacio,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error -> No se pudo borrar el espacio con id = " + req.params.id,
      error: error.message,
    });
  }
};
