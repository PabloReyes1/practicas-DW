// app/routers/nota.router.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/nota.controller.js');

// Crear
router.post('/api/notas/create', ctrl.create);

// Listar (?limit=&offset=&id_asignacion=&etiqueta=&desde=&hasta=)
router.get('/api/notas/all', ctrl.retrieveAll);

// Obtener por id
router.get('/api/notas/onebyid/:id', ctrl.getById);

// Resumen por asignación (?id_asignacion=)
router.get('/api/notas/summary', ctrl.summaryByAsignacion);

// Actualizar
router.put('/api/notas/update/:id', ctrl.updateById);

// Eliminar
router.delete('/api/notas/delete/:id', ctrl.deleteById);

module.exports = router;
