const db = require('../config/db.config.js');
const Mascota = db.Mascota;

exports.create = (req, res) => {
  let mascota = {};

  try {
    mascota.id_usuario = req.body.id_usuario;
    mascota.nombre = req.body.nombre;
    mascota.raza = req.body.raza;
    mascota.edad = req.body.edad;
    mascota.necesidades_especiales = req.body.necesidades_especiales;

    Mascota.create(mascota).then(result => {
      res.status(200).json({
        message: "Mascota creada con éxito con id = " + result.id_mascota,
        mascota: result,
      });
    });
  } catch (error) {
    res.status(500).json({
      message: "Error!",
      error: error.message
    });
  }
};

exports.retrieveAllMascotas = (req, res) => {
  Mascota.findAll()
    .then(mascotas => {
      res.status(200).json({
        message: "Operación de recuperación completada!",
        mascotas: mascotas
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

exports.getMascotaById = (req, res) => {
  let mascotaId = req.params.id;
  Mascota.findByPk(mascotaId)
    .then(mascota => {
      res.status(200).json({
        message: "Mascota obtenida con id = " + mascotaId,
        mascota: mascota
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
    let mascotaId = req.params.id;
    let mascota = await Mascota.findByPk(mascotaId);

    if (!mascota) {
      res.status(404).json({
        message: "No se encontró mascota para actualizar con id = " + mascotaId,
        mascota: "",
        error: "404"
      });
    } else {
      let updatedObject = {
        id_usuario: req.body.id_usuario,
        nombre: req.body.nombre,
        raza: req.body.raza,
        edad: req.body.edad,
        necesidades_especiales: req.body.necesidades_especiales
      };
      let result = await Mascota.update(updatedObject, { returning: true, where: { id_mascota: mascotaId } });

      if (!result) {
        res.status(500).json({
          message: "Error -> No se puede actualizar la mascota con id = " + req.params.id,
          error: "NO SE PUEDE ACTUALIZAR!!",
        });
      }

      res.status(200).json({
        message: "Actualización completa de la mascota con id = " + mascotaId,
        mascota: updatedObject,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error -> No se puede actualizar la mascota con id = " + req.params.id,
      error: error.message
    });
  }
};

exports.deleteById = async (req, res) => {
  try {
    let mascotaId = req.params.id;
    let mascota = await Mascota.findByPk(mascotaId);

    if (!mascota) {
      res.status(404).json({
        message: "No existe una mascota con id = " + mascotaId,
        error: "404",
      });
    } else {
      await mascota.destroy();
      res.status(200).json({
        message: "Mascota borrada con éxito con id = " + mascotaId,
        mascota: mascota,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error -> No se pudo borrar la mascota con id = " + req.params.id,
      error: error.message,
    });
  }
};
