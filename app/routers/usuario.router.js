const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/usuario.controller.js');

// Crear
router.post('/api/usuarios/create', ctrl.create);

// Listar (soporta ?limit=&offset=)
router.get('/api/usuarios/all', ctrl.retrieveAll);

// Obtener por id
router.get('/api/usuarios/onebyid/:id', ctrl.getById);

// Buscar por nombre o email (?q=)
router.get('/api/usuarios/search', ctrl.searchByNameOrEmail);

// Actualizar
router.put('/api/usuarios/update/:id', ctrl.updateById);

// Eliminar
router.delete('/api/usuarios/delete/:id', ctrl.deleteById);

module.exports = router;
