let express = require('express');
let router = express.Router();

const espacios = require('../controllers/espacio.controller.js');

router.post('/api/espacios/create', espacios.create);
router.get('/api/espacios/all', espacios.retrieveAllEspacios);
router.get('/api/espacios/onebyid/:id', espacios.getEspacioById);
router.put('/api/espacios/update/:id', espacios.updateById);
router.delete('/api/espacios/delete/:id', espacios.deleteById);

module.exports = router;
