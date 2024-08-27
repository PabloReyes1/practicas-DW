let express = require('express');
let router = express.Router();

const reservasEspacios = require('../controllers/reservaespacio.controller.js');

router.post('/api/reservaespacios/create', reservasEspacios.create);
router.get('/api/reservaespacios/all', reservasEspacios.retrieveAllReservasEspacios);
router.get('/api/reservaespacios/onebyid/:id', reservasEspacios.getReservaEspacioById);
router.put('/api/reservaespacios/update/:id', reservasEspacios.updateById);
router.delete('/api/reservaespacios/delete/:id', reservasEspacios.deleteById);

module.exports = router;
