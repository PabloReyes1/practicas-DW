// app/controllers/curso.controller.js
const { Op } = require('sequelize');
const db = require('../config/db.config.js');
const Curso = db.Curso;

const toDTO = (row) => (row?.toJSON ? row.toJSON() : row) || null;

exports.create = async (req, res) => {
  try {
    const required = ['nombre','grado_carrera'];
    for (const k of required) {
      if (req.body[k] === undefined || req.body[k] === null || req.body[k] === '')
        return res.status(400).json({ message: `Falta campo obligatorio: ${k}` });
    }

    const created = await Curso.create(req.body);
    return res.status(201).json({ message: 'Curso creado con éxito', curso: toDTO(created) });
  } catch (error) {
    return res.status(500).json({ message: 'Error!', error: error.message });
  }
};

exports.retrieveAll = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const offset = Number(req.query.offset) || 0;

    const rows = await Curso.findAll({
      order: [['id_curso', 'ASC']],
      limit, offset
    });

    return res.status(200).json({ message: 'OK', count: rows.length, cursos: rows.map(toDTO) });
  } catch (error) {
    return res.status(500).json({ message: 'Error!', error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: 'id inválido' });

    const row = await Curso.findByPk(id);
    if (!row) return res.status(404).json({ message: `No se encontró curso con id = ${id}` });

    return res.status(200).json({ message: 'OK', curso: toDTO(row) });
  } catch (error) {
    return res.status(500).json({ message: 'Error!', error: error.message });
  }
};

exports.search = async (req, res) => {
  try {
    const q = req.query.q?.trim();
    if (!q) return res.status(400).json({ message: 'Debe enviar query ?q=' });

    const likeOp = db.sequelize.getDialect() === 'postgres' ? Op.iLike : Op.like;

    const rows = await Curso.findAll({
      where: {
        [Op.or]: [
          { nombre: { [likeOp]: `%${q}%` } },
          { grado_carrera: { [likeOp]: `%${q}%` } }
        ]
      },
      order: [['nombre', 'ASC']]
    });

    return res.status(200).json({ message: `Búsqueda cursos: "${q}"`, cursos: rows.map(toDTO) });
  } catch (error) {
    return res.status(500).json({ message: 'Error!', error: error.message });
  }
};

exports.updateById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: 'id inválido' });

    const row = await Curso.findByPk(id);
    if (!row) return res.status(404).json({ message: `No se encontró curso con id = ${id}` });

    await row.update(req.body);
    await row.reload();

    return res.status(200).json({ message: `Curso actualizado (id=${id})`, curso: toDTO(row) });
  } catch (error) {
    return res.status(500).json({ message: 'Error!', error: error.message });
  }
};

exports.deleteById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: 'id inválido' });

    const row = await Curso.findByPk(id);
    if (!row) return res.status(404).json({ message: `No existe curso con id = ${id}` });

    await row.destroy();
    return res.status(200).json({ message: `Curso eliminado (id=${id})`, curso: toDTO(row) });
  } catch (error) {
    return res.status(500).json({ message: 'Error!', error: error.message });
  }
};
