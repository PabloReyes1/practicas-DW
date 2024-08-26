const db = require('../config/db.config.js');
const Usuario = db.Usuario;

exports.create = (req, res) => {
  let usuario = {};

  try {
    usuario.nombre = req.body.nombre;
    usuario.apellidos = req.body.apellidos;
    usuario.email = req.body.email;
    usuario.password = req.body.password;
    usuario.numero_telefono = req.body.numero_telefono;
    usuario.rol = req.body.rol;

    Usuario.create(usuario).then(result => {
      res.status(200).json({
        message: "Usuario creado con éxito con id = " + result.id_usuario,
        usuario: result,
      });
    });
  } catch (error) {
    res.status(500).json({
      message: "Error!",
      error: error.message
    });
  }
};

exports.retrieveAllUsuarios = (req, res) => {
  Usuario.findAll()
    .then(usuarios => {
      res.status(200).json({
        message: "Operación de recuperación completada!",
        usuarios: usuarios
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

exports.getUsuarioById = (req, res) => {
  let usuarioId = req.params.id;
  Usuario.findByPk(usuarioId)
    .then(usuario => {
      res.status(200).json({
        message: "Usuario obtenido con id = " + usuarioId,
        usuario: usuario
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
    let usuarioId = req.params.id;
    let usuario = await Usuario.findByPk(usuarioId);

    if (!usuario) {
      res.status(404).json({
        message: "No se encontró usuario para actualizar con id = " + usuarioId,
        usuario: "",
        error: "404"
      });
    } else {
      let updatedObject = {
        nombre: req.body.nombre,
        apellidos: req.body.apellidos,
        email: req.body.email,
        password: req.body.password,
        numero_telefono: req.body.numero_telefono,
        rol: req.body.rol
      };
      let result = await Usuario.update(updatedObject, { returning: true, where: { id_usuario: usuarioId } });

      if (!result) {
        res.status(500).json({
          message: "Error -> No se puede actualizar el usuario con id = " + req.params.id,
          error: "NO SE PUEDE ACTUALIZAR!!",
        });
      }

      res.status(200).json({
        message: "Actualización completa del usuario con id = " + usuarioId,
        usuario: updatedObject,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error -> No se puede actualizar el usuario con id = " + req.params.id,
      error: error.message
    });
  }
};

exports.deleteById = async (req, res) => {
  try {
    let usuarioId = req.params.id;
    let usuario = await Usuario.findByPk(usuarioId);

    if (!usuario) {
      res.status(404).json({
        message: "No existe un usuario con id = " + usuarioId,
        error: "404",
      });
    } else {
      await usuario.destroy();
      res.status(200).json({
        message: "Usuario borrado con éxito con id = " + usuarioId,
        usuario: usuario,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error -> No se pudo borrar el usuario con id = " + req.params.id,
      error: error.message,
    });
  }
};
