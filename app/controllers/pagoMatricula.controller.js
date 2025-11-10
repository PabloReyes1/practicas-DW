const db = require('../config/db.config.js');
const PagoMatricula = db.PagoMatricula;

const toDTO = (row) => (row?.toJSON ? row.toJSON() : row) || null;


exports.create = async (req, res) => {
  try {
    const required = ['carnet', 'estudiante', 'mes', 'semestre', 'anio', 'monto'];
    for (const k of required) {
      if (!req.body[k]) return res.status(400).json({ message: `Falta campo obligatorio: ${k}` });
    }

    const pago = await PagoMatricula.create(req.body);
    return res.status(201).json({ message: 'Pago de matrícula creado', pago: toDTO(pago) });
  } catch (error) {
    return res.status(500).json({ message: 'Error al crear pago', error: error.message });
  }
};


exports.retrieveAll = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const offset = Number(req.query.offset) || 0;
    const rows = await PagoMatricula.findAll({ order: [['id_pago', 'ASC']], limit, offset });
    return res.status(200).json({ message: 'OK', count: rows.length, pagos: rows.map(toDTO) });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener pagos', error: error.message });
  }
};


exports.getById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const pago = await PagoMatricula.findByPk(id);
    if (!pago) return res.status(404).json({ message: `No se encontró pago con id=${id}` });
    return res.status(200).json({ message: 'OK', pago: toDTO(pago) });
  } catch (error) {
    return res.status(500).json({ message: 'Error!', error: error.message });
  }
};


exports.updateById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const pago = await PagoMatricula.findByPk(id);
    if (!pago) return res.status(404).json({ message: `No se encontró pago con id=${id}` });

    await pago.update(req.body);
    return res.status(200).json({ message: 'Pago actualizado', pago: toDTO(pago) });
  } catch (error) {
    return res.status(500).json({ message: 'Error al actualizar', error: error.message });
  }
};

exports.deleteById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const pago = await PagoMatricula.findByPk(id);
    if (!pago) return res.status(404).json({ message: `No se encontró pago con id=${id}` });

    await pago.destroy();
    return res.status(200).json({ message: 'Pago eliminado', pago: toDTO(pago) });
  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar', error: error.message });
  }
};


exports.realizarPago = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const pago = await PagoMatricula.findByPk(id);
    if (!pago) return res.status(404).json({ message: 'Pago no encontrado' });

    // Aquí normalmente se hace la integración con Stripe
    const fakeTransaction = 'txn_' + Math.random().toString(36).substring(2, 12);
    await pago.update({ transactionStripe: fakeTransaction, statusStripe: 'pagado' });

    return res.status(200).json({
      message: 'Pago realizado correctamente',
      pago: toDTO(pago)
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error al procesar pago', error: error.message });
  }
};
