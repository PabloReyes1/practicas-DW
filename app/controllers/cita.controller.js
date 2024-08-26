const db = require('../config/db.config.js');
const Cita = db.Cita;

exports.create = (req, res) => {
  let cita = {};

  try {
    cita.id_mascota = req.body.id_mascota;
    cita.id_servicio = req.body.id_servicio;
    cita.fecha = req.body.fecha;
    cita.estado = req.body.estado;

    Cita.create(cita).then(result => {
      res.status(200).json({
        message: "Cita creada con éxito con id = " + result.id_cita,
        cita: result,
      });
    });
  } catch (error) {
    res.status(500).json({
      message: "Error!",
      error: error.message
    });
  }
};

exports.retrieveAllCitas = (req, res) => {
  Cita.findAll()
    .then(citas => {
      res.status(200).json({
        message: "Operación de recuperación completada!",
        citas: citas
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

exports.getCitaById = (req, res) => {
  let citaId = req.params.id;
  Cita.findByPk(citaId)
    .then(cita => {
      res.status(200).json({
        message: "Cita obtenida con id = " + citaId,
        cita: cita
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
    let citaId = req.params.id;
    let cita = await Cita.findByPk(citaId);

    if (!cita) {
      res.status(404).json({
        message: "No se encontró cita para actualizar con id = " + citaId,
        cita: "",
        error: "404"
      });
    } else {
      let updatedObject = {
        id_mascota: req.body.id_mascota,
        id_servicio: req.body.id_servicio,
        fecha: req.body.fecha,
        estado: req.body.estado
      };
      let result = await Cita.update(updatedObject, { returning: true, where: { id_cita: citaId } });

      if (!result) {
        res.status(500).json({
          message: "Error -> No se puede actualizar la cita con id = " + req.params.id,
          error: "NO SE PUEDE ACTUALIZAR!!",
        });
      }

      res.status(200).json({
        message: "Actualización completa de la cita con id = " + citaId,
        cita: updatedObject,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error -> No se puede actualizar la cita con id = " + req.params.id,
      error: error.message
    });
  }
};

exports.deleteById = async (req, res) => {
  try {
    let citaId = req.params.id;
    let cita = await Cita.findByPk(citaId);

    if (!cita) {
      res.status(404).json({
        message: "No existe una cita con id = " + citaId,
        error: "404",
      });
    } else {
      await cita.destroy();
      res.status(200).json({
        message: "Cita borrada con éxito con id = " + citaId,
        cita: cita,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error -> No se pudo borrar la cita con id = " + req.params.id,
      error: error.message,
    });
  }
};
