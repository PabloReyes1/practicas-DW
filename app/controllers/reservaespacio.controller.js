const db = require('../config/db.config.js');
const ReservaEspacio = db.ReservaEspacio;

exports.create = (req, res) => {
  let reservaEspacio = {};

  try {
    reservaEspacio.id_reserva = req.body.id_reserva;
    reservaEspacio.id_espacio = req.body.id_espacio;
    reservaEspacio.fecha_inicio = req.body.fecha_inicio;
    reservaEspacio.fecha_fin = req.body.fecha_fin;

    ReservaEspacio.create(reservaEspacio).then(result => {
      res.status(200).json({
        message: "Reserva de espacio creada con éxito con id = " + result.id_reserva_espacio,
        reserva_espacio: result,
      });
    });
  } catch (error) {
    res.status(500).json({
      message: "Error!",
      error: error.message
    });
  }
};

exports.retrieveAllReservasEspacios = (req, res) => {
  ReservaEspacio.findAll()
    .then(reservasEspacios => {
      res.status(200).json({
        message: "Operación de recuperación completada!",
        reservas_espacios: reservasEspacios
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

exports.getReservaEspacioById = (req, res) => {
  let reservaEspacioId = req.params.id;
  ReservaEspacio.findByPk(reservaEspacioId)
    .then(reservaEspacio => {
      res.status(200).json({
        message: "Reserva de espacio obtenida con id = " + reservaEspacioId,
        reserva_espacio: reservaEspacio
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
    let reservaEspacioId = req.params.id;
    let reservaEspacio = await ReservaEspacio.findByPk(reservaEspacioId);

    if (!reservaEspacio) {
      res.status(404).json({
        message: "No se encontró reserva de espacio para actualizar con id = " + reservaEspacioId,
        reserva_espacio: "",
        error: "404"
      });
    } else {
      let updatedObject = {
        id_reserva: req.body.id_reserva,
        id_espacio: req.body.id_espacio,
        fecha_inicio: req.body.fecha_inicio,
        fecha_fin: req.body.fecha_fin
      };
      let result = await ReservaEspacio.update(updatedObject, { returning: true, where: { id_reserva_espacio: reservaEspacioId } });

      if (!result) {
        res.status(500).json({
          message: "Error -> No se puede actualizar la reserva de espacio con id = " + req.params.id,
          error: "NO SE PUEDE ACTUALIZAR!!",
        });
      }

      res.status(200).json({
        message: "Actualización completa de la reserva de espacio con id = " + reservaEspacioId,
        reserva_espacio: updatedObject,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error -> No se puede actualizar la reserva de espacio con id = " + req.params.id,
      error: error.message
    });
  }
};

exports.deleteById = async (req, res) => {
  try {
    let reservaEspacioId = req.params.id;
    let reservaEspacio = await ReservaEspacio.findByPk(reservaEspacioId);

    if (!reservaEspacio) {
      res.status(404).json({
        message: "No existe una reserva de espacio con id = " + reservaEspacioId,
        error: "404",
      });
    } else {
      await reservaEspacio.destroy();
      res.status(200).json({
        message: "Reserva de espacio borrada con éxito con id = " + reservaEspacioId,
        reserva_espacio: reservaEspacio,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error -> No se pudo borrar la reserva de espacio con id = " + req.params.id,
      error: error.message,
    });
  }
};
