const db = require('../config/db.config.js');
const Music = db.Music;

exports.create = (req, res) => {
    let music = {};
  
    try {
      music.nombre = req.body.nombre;
      music.descripcion = req.body.descripcion;
      music.artista = req.body.artista;
      music.duracion = req.body.duracion;
      music.extencion = req.body.extencion;
      music.album = req.body.album;
      music.year = req.body.year;
  
      Music.create(music).then(result => {
        res.status(200).json({
          message: "Cancion subida con exito del id = " + result.id,
          music: result,
        });
      });
    } catch(error) {
      res.status(500).json({
        message: "Fail!",
        error: error.message
      });
    }
  };

  exports.retrieveAllMusic = (req, res) => {
    Music.findAll()
      .then(musicInfos => {
        res.status(200).json({
          message: "Obtener registros: Operacion completada!",
          musics: musicInfos
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

  exports.getMusicById = (req, res) => {
    let musicId = req.params.id;
    Music.findByPk(musicId)
      .then(music => {
        res.status(200).json({
          message: " Registro de musica obtenido con id = " + musicId,
          music: music
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
      let musicId = req.params.id;
      let music = await Music.findByPk(musicId);
  
      if(!music){
        res.status(404).json({
          message: "No se encontro registro de musica para actualizar con id = " + musicId,
          music: "",
          error: "404"
        });
      } else {    
        let updatedObject = {
          Nombre: req.body.nombre,
          descripcion: req.body.descripcion,
          artista: req.body.artista,
          duracion: req.body.duracion,
          extencion: req.body.extencion,
          album: req.body.album,
          year: req.body.year
        }
        let result = await Music.update(updatedObject, {returning: true, where: {id: musicId}});
        
        if(!result) {
          res.status(500).json({
            message: "Error -> No se puede actualizar la cancion con id = " + req.params.id,
            error: "NO SE PUEDE ACTUALIZAR!!",
          });
        }
  
        res.status(200).json({
          message: "Actualizacion completa de la cancion con id = " + musicId,
          music: updatedObject,
        });
      }
    } catch(error){
      res.status(500).json({
        message: "Error -> No se puede actualizar la cancion con id = " + req.params.id,
        error: error.message
      });
    }
  };

  exports.deleteById = async (req, res) => {
    try {
      let musicId = req.params.id;
      let music = await Music.findByPk(musicId);
  
      if(!music){
        res.status(404).json({
          message: "No existe una cancion con id = " + musicId,
          error: "404",
        });
      } else {
        await music.destroy();
        res.status(200).json({
          message: "Borramos con exito la cancion con id = " + musicId,
          music: music,
        });
      }
    } catch(error) {
      res.status(500).json({
        message: "Error -> No se pudo borrar la cancion con id = " + req.params.id,
        error: error.message,
      });
    }
  };
  