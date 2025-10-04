const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/catedratico.controller.js');

// Crear
router.post('/api/catedraticos/create', ctrl.create);

// Listar (?limit=&offset=)
router.get('/api/catedraticos/all', ctrl.retrieveAll);

// Obtener por id
router.get('/api/catedraticos/onebyid/:id', ctrl.getById);

// Buscar (?q=especialidad|nombre|apellido|email)
router.get('/api/catedraticos/search', ctrl.search);

// Actualizar
router.put('/api/catedraticos/update/:id', ctrl.updateById);

// Eliminar
router.delete('/api/catedraticos/delete/:id', ctrl.deleteById);

module.exports = router;
