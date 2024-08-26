let express = require('express');
let router = express.Router();

const mascotas = require('../controllers/mascota.controller.js');

router.post('/api/mascotas/create', mascotas.create);
router.get('/api/mascotas/all', mascotas.retrieveAllMascotas);
router.get('/api/mascotas/onebyid/:id', mascotas.getMascotaById);
router.put('/api/mascotas/update/:id', mascotas.updateById);
router.delete('/api/mascotas/delete/:id', mascotas.deleteById);

module.exports = router;
