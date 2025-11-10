const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/pagoMatricula.controller.js');


router.post('/api/pagosmatricula/create', ctrl.create);
router.get('/api/pagosmatricula/all', ctrl.retrieveAll);
router.get('/api/pagosmatricula/onebyid/:id', ctrl.getById);
router.put('/api/pagosmatricula/update/:id', ctrl.updateById);
router.delete('/api/pagosmatricula/delete/:id', ctrl.deleteById);


router.post('/api/pagosmatricula/pay/:id', ctrl.realizarPago);

module.exports = router;
