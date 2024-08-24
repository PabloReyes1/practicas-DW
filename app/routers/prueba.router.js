let express = require('express');
let router = express.Router();

const pruebas = require('../controllers/prueba.controller.js');

router.post('/api/pruebas/create', pruebas.create);
router.get('/api/pruebas/all', pruebas.retrieveAllPrueba);
router.get('/api/pruebas/onebyid/:id', pruebas.getPruebaById);
router.put('/api/pruebas/update/:id', pruebas.updateById);
router.delete('/api/pruebas/delete/:id', pruebas.deleteById);

module.exports = router;