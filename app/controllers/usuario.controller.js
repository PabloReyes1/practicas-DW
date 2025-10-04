const { Op } = require('sequelize');
const db = require('../config/db.config.js');
const Usuario = db.Usuario;

const toDTO = (row) => (row?.toJSON ? row.toJSON() : row) || null;

exports.create = async (req, res) => {
  try {
    const required = ['nombre','apellido','email','contrasena','rol'];
    for (const k of required) {
      if (req.body[k] === undefined || req.body[k] === null || req.body[k] === '')
        return res.status(400).json({ message: `Falta campo obligatorio: ${k}` });
    }

    const created = await Usuario.create(req.body);
    return res.status(201).json({ message: 'Usuario creado con éxito', usuario: toDTO(created) });
  } catch (error) {
    return res.status(500).json({ message: 'Error!', error: error.message });
  }
};

exports.retrieveAll = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const offset = Number(req.query.offset) || 0;

    const rows = await Usuario.findAll({
      order: [['id_usuario', 'ASC']],
      limit, offset
    });
    return res.status(200).json({ message: 'OK', count: rows.length, usuarios: rows.map(toDTO) });
  } catch (error) {
    return res.status(500).json({ message: 'Error!', error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: 'id inválido' });
    const row = await Usuario.findByPk(id);
    if (!row) return res.status(404).json({ message: `No se encontró usuario con id = ${id}` });
    return res.status(200).json({ message: 'OK', usuario: toDTO(row) });
  } catch (error) {
    return res.status(500).json({ message: 'Error!', error: error.message });
  }
};

exports.searchByNameOrEmail = async (req, res) => {
  try {
    const q = req.query.q?.trim();
    if (!q) return res.status(400).json({ message: 'Debe enviar query ?q=' });

    const likeOp = db.sequelize.getDialect() === 'postgres' ? Op.iLike : Op.like;
    const rows = await Usuario.findAll({
      where: {
        [Op.or]: [
          { nombre: { [likeOp]: `%${q}%` } },
          { apellido: { [likeOp]: `%${q}%` } },
          { email: { [likeOp]: `%${q}%` } }
        ]
      },
      order: [['apellido','ASC'], ['nombre','ASC']]
    });

    return res.status(200).json({ message: `Búsqueda: "${q}"`, usuarios: rows.map(toDTO) });
  } catch (error) {
    return res.status(500).json({ message: 'Error!', error: error.message });
  }
};

exports.updateById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: 'id inválido' });

    const row = await Usuario.findByPk(id);
    if (!row) return res.status(404).json({ message: `No se encontró usuario con id = ${id}` });

    await row.update(req.body);
    await row.reload();

    return res.status(200).json({ message: `Usuario actualizado (id=${id})`, usuario: toDTO(row) });
  } catch (error) {
    return res.status(500).json({ message: 'Error!', error: error.message });
  }
};

exports.deleteById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: 'id inválido' });

    const row = await Usuario.findByPk(id);
    if (!row) return res.status(404).json({ message: `No existe usuario con id = ${id}` });

    await row.destroy();
    return res.status(200).json({ message: `Usuario eliminado (id=${id})`, usuario: toDTO(row) });
  } catch (error) {
    return res.status(500).json({ message: 'Error!', error: error.message });
  }
};
