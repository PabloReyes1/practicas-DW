// app/controllers/nota.controller.js
const { Op, fn, col, literal } = require('sequelize');
const db = require('../config/db.config.js');
const Nota = db.Nota;
const Asignacion = db.Asignacion;
const Alumno = db.Alumno;
const Catedratico = db.Catedratico;
const Curso = db.Curso;
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
    const required = ['id_asignacion','etiqueta','ponderacion','nota','fecha_registro'];
    for (const k of required) {
      if (req.body[k] === undefined || req.body[k] === null || req.body[k] === '')
        return res.status(400).json({ message: `Falta campo obligatorio: ${k}` });
    }

    req.body.id_asignacion = toNumber(req.body.id_asignacion);
    req.body.ponderacion = toNumber(req.body.ponderacion);
    req.body.nota = toNumber(req.body.nota);
    req.body.fecha_registro = normalizeFechaOnly(req.body.fecha_registro);

    // Validar FK
    const asg = await Asignacion.findByPk(req.body.id_asignacion);
    if (!asg) return res.status(404).json({ message: `No existe asignación id=${req.body.id_asignacion}` });

    const created = await Nota.create(req.body);
    const withInc = await Nota.findByPk(created.id_nota, {
      include: [
        { model: Asignacion, include: [
          { model: Alumno, include: [Usuario] },
          { model: Curso },
          { model: Catedratico, include: [Usuario] }
        ]}
      ]
    });

    return res.status(201).json({ message: 'Nota creada con éxito', nota: toDTO(withInc) });
  } catch (error) {
    if (error?.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Ya existe una nota con esa etiqueta en la misma asignación.' });
    }
    return res.status(500).json({ message: 'Error!', error: error.message });
  }
};

exports.retrieveAll = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const offset = Number(req.query.offset) || 0;

    const where = {};
    if (req.query.id_asignacion) where.id_asignacion = toNumber(req.query.id_asignacion);
    if (req.query.etiqueta) where.etiqueta = { [Op.like]: `%${req.query.etiqueta}%` };

    if (req.query.desde || req.query.hasta) {
      where.fecha_registro = {};
      if (req.query.desde) where.fecha_registro[Op.gte] = normalizeFechaOnly(req.query.desde);
      if (req.query.hasta) where.fecha_registro[Op.lte] = normalizeFechaOnly(req.query.hasta);
    }

    const rows = await Nota.findAll({
      where,
      order: [['id_nota','ASC']],
      limit, offset,
      include: [
        { model: Asignacion, include: [
          { model: Alumno, include: [Usuario] },
          { model: Curso },
          { model: Catedratico, include: [Usuario] }
        ]}
      ]
    });

    return res.status(200).json({ message: 'OK', count: rows.length, notas: rows.map(toDTO) });
  } catch (error) {
    return res.status(500).json({ message: 'Error!', error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const id = toNumber(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: 'id inválido' });

    const row = await Nota.findByPk(id, {
      include: [
        { model: Asignacion, include: [
          { model: Alumno, include: [Usuario] },
          { model: Curso },
          { model: Catedratico, include: [Usuario] }
        ]}
      ]
    });
    if (!row) return res.status(404).json({ message: `No se encontró nota con id = ${id}` });

    return res.status(200).json({ message: 'OK', nota: toDTO(row) });
  } catch (error) {
    return res.status(500).json({ message: 'Error!', error: error.message });
  }
};

exports.updateById = async (req, res) => {
  try {
    const id = toNumber(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: 'id inválido' });

    const row = await Nota.findByPk(id);
    if (!row) return res.status(404).json({ message: `No se encontró nota con id = ${id}` });

    if (req.body.id_asignacion !== undefined) {
      req.body.id_asignacion = toNumber(req.body.id_asignacion);
      const asg = await Asignacion.findByPk(req.body.id_asignacion);
      if (!asg) return res.status(404).json({ message: `No existe asignación id=${req.body.id_asignacion}` });
    }
    if (req.body.ponderacion !== undefined) req.body.ponderacion = toNumber(req.body.ponderacion);
    if (req.body.nota !== undefined) req.body.nota = toNumber(req.body.nota);
    if (req.body.fecha_registro !== undefined) {
      req.body.fecha_registro = normalizeFechaOnly(req.body.fecha_registro);
    }

    await row.update(req.body);
    await row.reload({
      include: [
        { model: Asignacion, include: [
          { model: Alumno, include: [Usuario] },
          { model: Curso },
          { model: Catedratico, include: [Usuario] }
        ]}
      ]
    });

    return res.status(200).json({ message: `Nota actualizada (id=${id})`, nota: toDTO(row) });
  } catch (error) {
    if (error?.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Otra nota ya usa esa etiqueta en la misma asignación.' });
    }
    return res.status(500).json({ message: 'Error!', error: error.message });
  }
};

exports.deleteById = async (req, res) => {
  try {
    const id = toNumber(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: 'id inválido' });

    const row = await Nota.findByPk(id, {
      include: [
        { model: Asignacion, include: [
          { model: Alumno, include: [Usuario] },
          { model: Curso },
          { model: Catedratico, include: [Usuario] }
        ]}
      ]
    });
    if (!row) return res.status(404).json({ message: `No existe nota con id = ${id}` });

    await row.destroy();
    return res.status(200).json({ message: `Nota eliminada (id=${id})`, nota: toDTO(row) });
  } catch (error) {
    return res.status(500).json({ message: 'Error!', error: error.message });
  }
};

/**
 * Resumen por asignación:
 * - totalPonderacion: suma de ponderaciones [%]
 * - acumulado: sum(nota * ponderacion) / 100
 * - faltantePonderacion: 100 - totalPonderacion (si > 0)
 */
exports.summaryByAsignacion = async (req, res) => {
  try {
    const id_asignacion = toNumber(req.query.id_asignacion);
    if (!Number.isInteger(id_asignacion)) {
      return res.status(400).json({ message: 'Debe enviar ?id_asignacion=' });
    }

    const asg = await Asignacion.findByPk(id_asignacion, {
      include: [
        { model: Alumno, include: [Usuario] },
        { model: Curso },
        { model: Catedratico, include: [Usuario] }
      ]
    });
    if (!asg) return res.status(404).json({ message: `No existe asignación id=${id_asignacion}` });

    const notas = await Nota.findAll({ where: { id_asignacion } });

    const totalPonderacion = notas.reduce((acc, n) => acc + Number(n.ponderacion || 0), 0);
    const acumulado = notas.reduce((acc, n) => acc + (Number(n.nota || 0) * Number(n.ponderacion || 0)) / 100, 0);
    const faltantePonderacion = Math.max(0, 100 - totalPonderacion);

    return res.status(200).json({
      message: 'Resumen de notas',
      asignacion: toDTO(asg),
      totalPonderacion: Number(totalPonderacion.toFixed(2)),
      acumulado: Number(acumulado.toFixed(2)),
      faltantePonderacion: Number(faltantePonderacion.toFixed(2)),
      completo: totalPonderacion >= 100
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error!', error: error.message });
  }
};
