let express = require('express');
let router = express.Router();

const servicios = require('../controllers/servicio.controller.js');

router.post('/api/servicios/create', servicios.create);
router.get('/api/servicios/all', servicios.retrieveAllServicios);
router.get('/api/servicios/onebyid/:id', servicios.getServicioById);
router.put('/api/servicios/update/:id', servicios.updateById);
router.delete('/api/servicios/delete/:id', servicios.deleteById);

module.exports = router;
