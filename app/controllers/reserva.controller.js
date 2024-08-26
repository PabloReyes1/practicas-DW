const db = require('../config/db.config.js');
const Reserva = db.Reserva;

exports.create = (req, res) => {
  let reserva = {};

  try {
    reserva.id_mascota = req.body.id_mascota;
    reserva.fecha_inicio = req.body.fecha_inicio;
    reserva.fecha_fin = req.body.fecha_fin;
    reserva.estado = req.body.estado;

    Reserva.create(reserva).then(result => {
      res.status(200).json({
        message: "Reserva creada con éxito con id = " + result.id_reserva,
        reserva: result,
      });
    });
  } catch (error) {
    res.status(500).json({
      message: "Error!",
      error: error.message
    });
  }
};

exports.retrieveAllReservas = (req, res) => {
  Reserva.findAll()
    .then(reservas => {
      res.status(200).json({
        message: "Operación de recuperación completada!",
        reservas: reservas
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

exports.getReservaById = (req, res) => {
  let reservaId = req.params.id;
  Reserva.findByPk(reservaId)
    .then(reserva => {
      res.status(200).json({
        message: "Reserva obtenida con id = " + reservaId,
        reserva: reserva
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
    let reservaId = req.params.id;
    let reserva = await Reserva.findByPk(reservaId);

    if (!reserva) {
      res.status(404).json({
        message: "No se encontró reserva para actualizar con id = " + reservaId,
        reserva: "",
        error: "404"
      });
    } else {
      let updatedObject = {
        id_mascota: req.body.id_mascota,
        fecha_inicio: req.body.fecha_inicio,
        fecha_fin: req.body.fecha_fin,
        estado: req.body.estado
      };
      let result = await Reserva.update(updatedObject, { returning: true, where: { id_reserva: reservaId } });

      if (!result) {
        res.status(500).json({
          message: "Error -> No se puede actualizar la reserva con id = " + req.params.id,
          error: "NO SE PUEDE ACTUALIZAR!!",
        });
      }

      res.status(200).json({
        message: "Actualización completa de la reserva con id = " + reservaId,
        reserva: updatedObject,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error -> No se puede actualizar la reserva con id = " + req.params.id,
      error: error.message
    });
  }
};

exports.deleteById = async (req, res) => {
  try {
    let reservaId = req.params.id;
    let reserva = await Reserva.findByPk(reservaId);

    if (!reserva) {
      res.status(404).json({
        message: "No existe una reserva con id = " + reservaId,
        error: "404",
      });
    } else {
      await reserva.destroy();
      res.status(200).json({
        message: "Reserva borrada con éxito con id = " + reservaId,
        reserva: reserva,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error -> No se pudo borrar la reserva con id = " + req.params.id,
      error: error.message,
    });
  }
};
