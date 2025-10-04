// app/controllers/alumno.controller.js
const { Op } = require('sequelize');
const db = require('../config/db.config.js');
const Alumno = db.Alumno;
const Usuario = db.Usuario;

const toDTO = (row) => (row?.toJSON ? row.toJSON() : row) || null;

function normalizeFechaOnly(value) {
  // Acepta 'YYYY-MM-DD' o 'YYYY/MM/DD' y devuelve 'YYYY-MM-DD'
  if (!value) return value;
  const s = String(value).trim().replace(/\//g, '-');
  // Si viene con hora, nos quedamos con la parte de fecha
  return s.split('T')[0];
}

exports.create = async (req, res) => {
  try {
    const required = ['id_usuario','grado_carrera','matricula','fecha_ingreso'];
    for (const k of required) {
      if (req.body[k] === undefined || req.body[k] === null || req.body[k] === '')
        return res.status(400).json({ message: `Falta campo obligatorio: ${k}` });
    }

    // Normalizar tipos
    req.body.id_usuario = Number(req.body.id_usuario);
    req.body.fecha_ingreso = normalizeFechaOnly(req.body.fecha_ingreso);

    // Verificar existencia de usuario
    const usr = await Usuario.findByPk(req.body.id_usuario);
    if (!usr) return res.status(404).json({ message: `No existe usuario con id = ${req.body.id_usuario}` });

    const created = await Alumno.create(req.body);
    const withUser = await Alumno.findByPk(created.id_alumno, { include: [{ model: Usuario }] });

    return res.status(201).json({ message: 'Alumno creado con éxito', alumno: toDTO(withUser) });
  } catch (error) {
    return res.status(500).json({ message: 'Error!', error: error.message });
  }
};

exports.retrieveAll = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const offset = Number(req.query.offset) || 0;

    const rows = await Alumno.findAll({
      order: [['id_alumno', 'ASC']],
      limit, offset,
      include: [{ model: Usuario }]
    });
    return res.status(200).json({ message: 'OK', count: rows.length, alumnos: rows.map(toDTO) });
  } catch (error) {
    return res.status(500).json({ message: 'Error!', error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: 'id inválido' });

    const row = await Alumno.findByPk(id, { include: [{ model: Usuario }] });
    if (!row) return res.status(404).json({ message: `No se encontró alumno con id = ${id}` });

    return res.status(200).json({ message: 'OK', alumno: toDTO(row) });
  } catch (error) {
    return res.status(500).json({ message: 'Error!', error: error.message });
  }
};

exports.search = async (req, res) => {
  try {
    const q = req.query.q?.trim();
    if (!q) return res.status(400).json({ message: 'Debe enviar query ?q=' });

    const likeOp = db.sequelize.getDialect() === 'postgres' ? Op.iLike : Op.like;

    const rows = await Alumno.findAll({
      include: [{ model: Usuario }],
      where: {
        [Op.or]: [
          { matricula: { [likeOp]: `%${q}%` } },
        ]
      },
      order: [['matricula','ASC']]
    });

    // Además buscamos por nombre/apellido via include
    const rowsByUser = await Alumno.findAll({
      include: [{
        model: Usuario,
        where: {
          [Op.or]: [
            { nombre: { [likeOp]: `%${q}%` } },
            { apellido: { [likeOp]: `%${q}%` } },
            { email: { [likeOp]: `%${q}%` } }
          ]
        }
      }],
      order: [[{ model: Usuario }, 'apellido', 'ASC'], [{ model: Usuario }, 'nombre', 'ASC']]
    });

    // Unir resultados sin duplicar por id_alumno
    const map = new Map();
    [...rows, ...rowsByUser].forEach(r => map.set(r.id_alumno, r));

    return res.status(200).json({
      message: `Búsqueda alumnos: "${q}"`,
      count: map.size,
      alumnos: Array.from(map.values()).map(toDTO)
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error!', error: error.message });
  }
};

exports.updateById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: 'id inválido' });

    const row = await Alumno.findByPk(id);
    if (!row) return res.status(404).json({ message: `No se encontró alumno con id = ${id}` });

    if (req.body.id_usuario !== undefined) {
      req.body.id_usuario = Number(req.body.id_usuario);
      const usr = await Usuario.findByPk(req.body.id_usuario);
      if (!usr) return res.status(404).json({ message: `No existe usuario con id = ${req.body.id_usuario}` });
    }
    if (req.body.fecha_ingreso !== undefined) {
      req.body.fecha_ingreso = normalizeFechaOnly(req.body.fecha_ingreso);
    }

    await row.update(req.body);
    await row.reload({ include: [{ model: Usuario }] });

    return res.status(200).json({ message: `Alumno actualizado (id=${id})`, alumno: toDTO(row) });
  } catch (error) {
    return res.status(500).json({ message: 'Error!', error: error.message });
  }
};

exports.deleteById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: 'id inválido' });

    const row = await Alumno.findByPk(id, { include: [{ model: Usuario }] });
    if (!row) return res.status(404).json({ message: `No existe alumno con id = ${id}` });

    await row.destroy();
    return res.status(200).json({ message: `Alumno eliminado (id=${id})`, alumno: toDTO(row) });
  } catch (error) {
    return res.status(500).json({ message: 'Error!', error: error.message });
  }
};
