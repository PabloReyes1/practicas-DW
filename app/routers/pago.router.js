// app/routers/pago.router.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/pago.controller.js');

// Crear
router.post('/api/pagos/create', ctrl.create);

// Listar (?limit=&offset=&id_alumno=&estado=&metodo=&moneda=&concepto=&desde=&hasta=)
router.get('/api/pagos/all', ctrl.retrieveAll);

// Obtener por id
router.get('/api/pagos/onebyid/:id', ctrl.getById);

// Resumen por alumno (?id_alumno=&desde=&hasta=&moneda=)
router.get('/api/pagos/summary/byAlumno', ctrl.summaryByAlumno);

// Actualizar
router.put('/api/pagos/update/:id', ctrl.updateById);

// Eliminar
router.delete('/api/pagos/delete/:id', ctrl.deleteById);

module.exports = router;
