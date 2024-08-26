let express = require('express');
let router = express.Router();

const reservas = require('../controllers/reserva.controller.js');

router.post('/api/reservas/create', reservas.create);
router.get('/api/reservas/all', reservas.retrieveAllReservas);
router.get('/api/reservas/onebyid/:id', reservas.getReservaById);
router.put('/api/reservas/update/:id', reservas.updateById);
router.delete('/api/reservas/delete/:id', reservas.deleteById);

module.exports = router;
