// app/routers/curso.router.js
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/curso.controller.js');

// Crear
router.post('/api/cursos/create', ctrl.create);

// Listar (?limit=&offset=)
router.get('/api/cursos/all', ctrl.retrieveAll);

// Obtener por id
router.get('/api/cursos/onebyid/:id', ctrl.getById);

// Buscar (?q=nombre|grado_carrera)
router.get('/api/cursos/search', ctrl.search);

// Actualizar
router.put('/api/cursos/update/:id', ctrl.updateById);

// Eliminar
router.delete('/api/cursos/delete/:id', ctrl.deleteById);

module.exports = router;
