const { Op } = require('sequelize');
const db = require('../config/db.config.js');
const Titulo = db.Titulo;

// Helpers
function normalizeActoresIn(body) {
  // Acepta actores como array o string y lo deja como string "a,b,c"
  if (Array.isArray(body.actores)) {
    body.actores = body.actores.join(', ');
  }
  return body;
}

function toDTO(row) {
  // Devuelve actores como array para el cliente
  const dto = row?.toJSON ? row.toJSON() : row;
  if (!dto) return dto;
  return {
    ...dto,
    actores: typeof dto.actores === 'string'
      ? dto.actores.split(',').map(s => s.trim()).filter(Boolean)
      : dto.actores
  };
}

exports.create = async (req, res) => {
  try {
    const required = ['nombre','sinopsis','actores','duracionMin','tipo','categoria','anio'];
    for (const k of required) {
      if (req.body[k] === undefined || req.body[k] === null || req.body[k] === '')
        return res.status(400).json({ message: `Falta campo obligatorio: ${k}` });
    }

    const payload = normalizeActoresIn({ ...req.body });
    // normalizar 'Pelicula' -> 'Película'
    if (payload.tipo === 'Pelicula') payload.tipo = 'Película';

    const result = await Titulo.create(payload);
    return res.status(201).json({
      message: 'Título creado con éxito',
      titulo: toDTO(result)
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error!', error: error.message });
  }
};

exports.retrieveAllTitulos = async (_req, res) => {
  try {
    const rows = await Titulo.findAll({ order: [['id_titulo', 'ASC']] });
    return res.status(200).json({
      message: 'Operación de recuperación completada!',
      titulos: rows.map(toDTO)
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error!', error });
  }
};

exports.getTituloById = async (req, res) => {
  try {
    const id = req.params.id;
    const row = await Titulo.findByPk(id);
    if (!row) return res.status(404).json({ message: `No se encontró título con id = ${id}` });
    return res.status(200).json({
      message: `Título obtenido con id = ${id}`,
      titulo: toDTO(row)
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error!', error });
  }
};

exports.getByName = async (req, res) => {
  try {
    const name = req.params.name;
    if (!name) return res.status(400).json({ message: 'Debe enviar el nombre a buscar' });

    const rows = await Titulo.findAll({
      where: { nombre: { [Op.like]: `%${name}%` } },
      order: [['nombre', 'ASC']]
    });

    return res.status(200).json({
      message: `Búsqueda por nombre: "${name}"`,
      titulos: rows.map(toDTO)
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error!', error });
  }
};

exports.updateById = async (req, res) => {
  try {
    const id = req.params.id;
    const row = await Titulo.findByPk(id);
    if (!row) {
      return res.status(404).json({
        message: `No se encontró título para actualizar con id = ${id}`,
        error: '404'
      });
    }

    const payload = normalizeActoresIn({ ...req.body });
    if (payload.tipo === 'Pelicula') payload.tipo = 'Película';

    await Titulo.update(payload, { returning: true, where: { id_titulo: id } });

    return res.status(200).json({
      message: `Actualización completa del título con id = ${id}`,
      titulo: toDTO({ ...row.toJSON(), ...req.body })
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error -> No se puede actualizar el título con id = ${req.params.id}`,
      error: error.message
    });
  }
};

exports.deleteById = async (req, res) => {
  try {
    const id = req.params.id;
    const row = await Titulo.findByPk(id);
    if (!row) {
      return res.status(404).json({
        message: `No existe un título con id = ${id}`,
        error: '404'
      });
    }

    await row.destroy();
    return res.status(200).json({
      message: `Título borrado con éxito con id = ${id}`,
      titulo: toDTO(row)
    });
  } catch (error) {
    return res.status(500).json({
      message: `Error -> No se pudo borrar el título con id = ${req.params.id}`,
      error: error.message
    });
  }
};
