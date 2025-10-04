// app/routers/asignacion.router.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/asignacion.controller.js');

// Crear
router.post('/api/asignaciones/create', ctrl.create);

// Listar (?limit=&offset=&id_alumno=&id_curso=&id_catedratico=&ciclo=&anio=)
router.get('/api/asignaciones/all', ctrl.retrieveAll);

// Obtener por id
router.get('/api/asignaciones/onebyid/:id', ctrl.getById);

// Actualizar
router.put('/api/asignaciones/update/:id', ctrl.updateById);

// Eliminar
router.delete('/api/asignaciones/delete/:id', ctrl.deleteById);

module.exports = router;
