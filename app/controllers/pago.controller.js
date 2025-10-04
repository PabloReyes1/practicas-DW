// app/controllers/pago.controller.js
const { Op, fn, col } = require('sequelize');
const db = require('../config/db.config.js');
const Pago = db.Pago;
const Alumno = db.Alumno;
const Usuario = db.Usuario;

const toDTO = (row) => (row?.toJSON ? row.toJSON() : row) || null;

function normalizeFechaOnly(value) {
  if (!value) return value;
  const s = String(value).trim().replace(/\//g, '-');
  return s.split('T')[0];
}
function toNumber(x) {
  const n = Number(x);
  return Number.isFinite(n) ? n : null;
}

exports.create = async (req, res) => {
  try {
    const required = ['id_alumno','concepto','monto','moneda','metodo','estado','fecha_pago'];
    for (const k of required) {
      if (req.body[k] === undefined || req.body[k] === null || req.body[k] === '')
        return res.status(400).json({ message: `Falta campo obligatorio: ${k}` });
    }

    req.body.id_alumno = toNumber(req.body.id_alumno);
    req.body.monto = toNumber(req.body.monto);
    req.body.fecha_pago = normalizeFechaOnly(req.body.fecha_pago);

    // validar FK
    const al = await Alumno.findByPk(req.body.id_alumno);
    if (!al) return res.status(404).json({ message: `No existe alumno id=${req.body.id_alumno}` });

    const created = await Pago.create(req.body);
    const withInc = await Pago.findByPk(created.id_pago, {
      include: [{ model: Alumno, include: [Usuario] }]
    });

    return res.status(201).json({ message: 'Pago creado con éxito', pago: toDTO(withInc) });
  } catch (error) {
    if (error?.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'La referencia de pago ya existe.' });
    }
    return res.status(500).json({ message: 'Error!', error: error.message });
  }
};

exports.retrieveAll = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const offset = Number(req.query.offset) || 0;

    const where = {};
    if (req.query.id_alumno) where.id_alumno = toNumber(req.query.id_alumno);
    if (req.query.estado) where.estado = String(req.query.estado).toLowerCase();
    if (req.query.metodo) where.metodo = String(req.query.metodo).toLowerCase();
    if (req.query.moneda) where.moneda = String(req.query.moneda).toUpperCase();
    if (req.query.concepto) where.concepto = { [Op.like]: `%${req.query.concepto}%` };

    if (req.query.desde || req.query.hasta) {
      where.fecha_pago = {};
      if (req.query.desde) where.fecha_pago[Op.gte] = normalizeFechaOnly(req.query.desde);
      if (req.query.hasta) where.fecha_pago[Op.lte] = normalizeFechaOnly(req.query.hasta);
    }

    const rows = await Pago.findAll({
      where,
      order: [['fecha_pago','DESC'], ['id_pago','ASC']],
      limit, offset,
      include: [{ model: Alumno, include: [Usuario] }]
    });

    return res.status(200).json({ message: 'OK', count: rows.length, pagos: rows.map(toDTO) });
  } catch (error) {
    return res.status(500).json({ message: 'Error!', error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const id = toNumber(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: 'id inválido' });

    const row = await Pago.findByPk(id, { include: [{ model: Alumno, include: [Usuario] }] });
    if (!row) return res.status(404).json({ message: `No se encontró pago con id = ${id}` });

    return res.status(200).json({ message: 'OK', pago: toDTO(row) });
  } catch (error) {
    return res.status(500).json({ message: 'Error!', error: error.message });
  }
};

exports.updateById = async (req, res) => {
  try {
    const id = toNumber(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: 'id inválido' });

    const row = await Pago.findByPk(id);
    if (!row) return res.status(404).json({ message: `No se encontró pago con id = ${id}` });

    if (req.body.id_alumno !== undefined) {
      req.body.id_alumno = toNumber(req.body.id_alumno);
      const al = await Alumno.findByPk(req.body.id_alumno);
      if (!al) return res.status(404).json({ message: `No existe alumno id=${req.body.id_alumno}` });
    }
    if (req.body.monto !== undefined) req.body.monto = toNumber(req.body.monto);
    if (req.body.fecha_pago !== undefined) req.body.fecha_pago = normalizeFechaOnly(req.body.fecha_pago);
    if (req.body.moneda !== undefined) req.body.moneda = String(req.body.moneda).toUpperCase();
    if (req.body.metodo !== undefined) req.body.metodo = String(req.body.metodo).toLowerCase();
    if (req.body.estado !== undefined) req.body.estado = String(req.body.estado).toLowerCase();

    await row.update(req.body);
    await row.reload({ include: [{ model: Alumno, include: [Usuario] }] });

    return res.status(200).json({ message: `Pago actualizado (id=${id})`, pago: toDTO(row) });
  } catch (error) {
    if (error?.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'La referencia de pago ya existe.' });
    }
    return res.status(500).json({ message: 'Error!', error: error.message });
  }
};

exports.deleteById = async (req, res) => {
  try {
    const id = toNumber(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: 'id inválido' });

    const row = await Pago.findByPk(id, { include: [{ model: Alumno, include: [Usuario] }] });
    if (!row) return res.status(404).json({ message: `No existe pago con id = ${id}` });

    await row.destroy();
    return res.status(200).json({ message: `Pago eliminado (id=${id})`, pago: toDTO(row) });
  } catch (error) {
    return res.status(500).json({ message: 'Error!', error: error.message });
  }
};

/**
 * Resumen por alumno (opcionalmente con rango de fechas):
 * - Totales por estado y moneda
 * - Sumas globales por moneda
 */
exports.summaryByAlumno = async (req, res) => {
  try {
    const id_alumno = toNumber(req.query.id_alumno);
    if (!Number.isInteger(id_alumno)) {
      return res.status(400).json({ message: 'Debe enviar ?id_alumno=' });
    }

    // confirmar alumno
    const alumno = await Alumno.findByPk(id_alumno, { include: [Usuario] });
    if (!alumno) return res.status(404).json({ message: `No existe alumno id=${id_alumno}` });

    const where = { id_alumno };
    if (req.query.desde || req.query.hasta) {
      where.fecha_pago = {};
      if (req.query.desde) where.fecha_pago[Op.gte] = normalizeFechaOnly(req.query.desde);
      if (req.query.hasta) where.fecha_pago[Op.lte] = normalizeFechaOnly(req.query.hasta);
    }
    if (req.query.moneda) where.moneda = String(req.query.moneda).toUpperCase();

    const rows = await Pago.findAll({
      attributes: [
        'moneda',
        'estado',
        [fn('SUM', col('monto')), 'total']
      ],
      where,
      group: ['moneda','estado']
    });

    // Armar estructura { [moneda]: { pagado, pendiente, anulado, total } }
    const resumen = {};
    for (const r of rows) {
      const m = r.get('moneda');
      const e = r.get('estado');
      const t = Number(r.get('total'));
      if (!resumen[m]) resumen[m] = { pagado: 0, pendiente: 0, anulado: 0, total: 0 };
      resumen[m][e] += t;
      resumen[m].total += t;
    }

    return res.status(200).json({
      message: 'Resumen de pagos por alumno',
      alumno: toDTO(alumno),
      rango: {
        desde: req.query.desde ? normalizeFechaOnly(req.query.desde) : null,
        hasta: req.query.hasta ? normalizeFechaOnly(req.query.hasta) : null
      },
      resumen
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error!', error: error.message });
  }
};
