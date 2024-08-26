let express = require('express');
let router = express.Router();

const reservasEspacios = require('../controllers/reserva_espacio.controller.js');

router.post('/api/reservas_espacios/create', reservasEspacios.create);
router.get('/api/reservas_espacios/all', reservasEspacios.retrieveAllReservasEspacios);
router.get('/api/reservas_espacios/onebyid/:id', reservasEspacios.getReservaEspacioById);
router.put('/api/reservas_espacios/update/:id', reservasEspacios.updateById);
router.delete('/api/reservas_espacios/delete/:id', reservasEspacios.deleteById);

module.exports = router;
