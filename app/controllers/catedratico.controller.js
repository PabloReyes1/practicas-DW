const { Op } = require('sequelize');
const db = require('../config/db.config.js');
const Catedratico = db.Catedratico;
const Usuario = db.Usuario;

const toDTO = (row) => (row?.toJSON ? row.toJSON() : row) || null;

exports.create = async (req, res) => {
  try {
    const required = ['id_usuario','especialidad','horario'];
    for (const k of required) {
      if (req.body[k] === undefined || req.body[k] === null || req.body[k] === '')
        return res.status(400).json({ message: `Falta campo obligatorio: ${k}` });
    }

    req.body.id_usuario = Number(req.body.id_usuario);
    const usr = await Usuario.findByPk(req.body.id_usuario);
    if (!usr) return res.status(404).json({ message: `No existe usuario con id = ${req.body.id_usuario}` });

    const created = await Catedratico.create(req.body);
    const withUser = await Catedratico.findByPk(created.id_catedratico, { include: [{ model: Usuario }] });
    return res.status(201).json({ message: 'Catedrático creado con éxito', catedratico: toDTO(withUser) });
  } catch (error) {
    return res.status(500).json({ message: 'Error!', error: error.message });
  }
};

exports.retrieveAll = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const offset = Number(req.query.offset) || 0;

    const rows = await Catedratico.findAll({
      order: [['id_catedratico', 'ASC']],
      limit, offset,
      include: [{ model: Usuario }]
    });
    return res.status(200).json({ message: 'OK', count: rows.length, catedraticos: rows.map(toDTO) });
  } catch (error) {
    return res.status(500).json({ message: 'Error!', error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: 'id inválido' });

    const row = await Catedratico.findByPk(id, { include: [{ model: Usuario }] });
    if (!row) return res.status(404).json({ message: `No se encontró catedrático con id = ${id}` });

    return res.status(200).json({ message: 'OK', catedratico: toDTO(row) });
  } catch (error) {
    return res.status(500).json({ message: 'Error!', error: error.message });
  }
};

exports.search = async (req, res) => {
  try {
    const q = req.query.q?.trim();
    if (!q) return res.status(400).json({ message: 'Debe enviar query ?q=' });

    const likeOp = db.sequelize.getDialect() === 'postgres' ? Op.iLike : Op.like;

    const rowsByFields = await Catedratico.findAll({
      where: {
        especialidad: { [likeOp]: `%${q}%` }
      },
      include: [{ model: Usuario }]
    });

    const rowsByUser = await Catedratico.findAll({
      include: [{
        model: Usuario,
        where: {
          [Op.or]: [
            { nombre: { [likeOp]: `%${q}%` } },
            { apellido: { [likeOp]: `%${q}%` } },
            { email: { [likeOp]: `%${q}%` } }
          ]
        }
      }]
    });

    const map = new Map();
    [...rowsByFields, ...rowsByUser].forEach(r => map.set(r.id_catedratico, r));

    return res.status(200).json({
      message: `Búsqueda catedráticos: "${q}"`,
      count: map.size,
      catedraticos: Array.from(map.values()).map(toDTO)
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error!', error: error.message });
  }
};

exports.updateById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: 'id inválido' });

    const row = await Catedratico.findByPk(id);
    if (!row) return res.status(404).json({ message: `No se encontró catedrático con id = ${id}` });

    if (req.body.id_usuario !== undefined) {
      req.body.id_usuario = Number(req.body.id_usuario);
      const usr = await Usuario.findByPk(req.body.id_usuario);
      if (!usr) return res.status(404).json({ message: `No existe usuario con id = ${req.body.id_usuario}` });
    }

    await row.update(req.body);
    await row.reload({ include: [{ model: Usuario }] });

    return res.status(200).json({ message: `Catedrático actualizado (id=${id})`, catedratico: toDTO(row) });
  } catch (error) {
    return res.status(500).json({ message: 'Error!', error: error.message });
  }
};

exports.deleteById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: 'id inválido' });

    const row = await Catedratico.findByPk(id, { include: [{ model: Usuario }] });
    if (!row) return res.status(404).json({ message: `No existe catedrático con id = ${id}` });

    await row.destroy();
    return res.status(200).json({ message: `Catedrático eliminado (id=${id})`, catedratico: toDTO(row) });
  } catch (error) {
    return res.status(500).json({ message: 'Error!', error: error.message });
  }
};
