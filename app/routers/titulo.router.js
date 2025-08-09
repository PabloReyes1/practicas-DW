let express = require('express');
let router = express.Router();

const titulos = require('../controllers/titulo.controller.js');

// Crear
router.post('/api/titulos/create', titulos.create);

// Listar todo
router.get('/api/titulos/all', titulos.retrieveAllTitulos);

// Obtener por id
router.get('/api/titulos/onebyid/:id', titulos.getTituloById);

// Buscar por nombre (GET BY NAME)
router.get('/api/titulos/byname/:name', titulos.getByName);

// Actualizar
router.put('/api/titulos/update/:id', titulos.updateById);

// Eliminar
router.delete('/api/titulos/delete/:id', titulos.deleteById);

module.exports = router;
