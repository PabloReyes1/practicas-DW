let express = require('express');
let router = express.Router();

const citas = require('../controllers/cita.controller.js');

router.post('/api/citas/create', citas.create);
router.get('/api/citas/all', citas.retrieveAllCitas);
router.get('/api/citas/onebyid/:id', citas.getCitaById);
router.put('/api/citas/update/:id', citas.updateById);
router.delete('/api/citas/delete/:id', citas.deleteById);

module.exports = router;
