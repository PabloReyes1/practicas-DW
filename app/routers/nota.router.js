const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/nota.controller.js');

// Si el controller no trae la función, respondemos 501 en lugar de crashear
const safe = (fn) =>
  typeof fn === 'function'
    ? fn
    : (_req, res) => res.status(501).json({ ok: false, error: 'handler not implemented' });

// Crear
router.post('/api/notas/create', safe(ctrl.create));

// Listar (?limit=&offset=&id_asignacion=&etiqueta=&desde=&hasta=)
router.get('/api/notas/all', safe(ctrl.retrieveAll));

// Obtener por id
router.get('/api/notas/onebyid/:id', safe(ctrl.getById));

// Resumen por asignación (?id_asignacion=)
router.get('/api/notas/summary', safe(ctrl.summaryByAsignacion));

// 👉 Matriz (para el módulo tipo hoja de notas)
router.get('/api/notas/matriz', safe(ctrl.matriz));
router.post('/api/notas/matriz', safe(ctrl.matrizUpsert));

// 👉 Publicar notas de un curso/parcial
router.post('/api/notas/publicar', safe(ctrl.publicar));

// Actualizar
router.put('/api/notas/update/:id', safe(ctrl.updateById));

// Eliminar
router.delete('/api/notas/delete/:id', safe(ctrl.deleteById));

module.exports = router;
