// app/routers/alumno.router.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/alumno.controller.js');

// Crear
router.post('/api/alumnos/create', ctrl.create);

// Listar (?limit=&offset=)
router.get('/api/alumnos/all', ctrl.retrieveAll);

// Obtener por id
router.get('/api/alumnos/onebyid/:id', ctrl.getById);

// Buscar (?q=matricula|nombre|apellido|email)
router.get('/api/alumnos/search', ctrl.search);

// Actualizar
router.put('/api/alumnos/update/:id', ctrl.updateById);

// Eliminar
router.delete('/api/alumnos/delete/:id', ctrl.deleteById);

module.exports = router;
