// app/controllers/asignacion.controller.js
const { Op } = require('sequelize');
const db = require('../config/db.config.js');
const Asignacion = db.Asignacion;
const Alumno = db.Alumno;
const Curso = db.Curso;
const Catedratico = db.Catedratico;
const Usuario = db.Usuario;

const toDTO = (row) => (row?.toJSON ? row.toJSON() : row) || null;

function normalizeInt(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

exports.create = async (req, res) => {
  try {
    const required = ['id_alumno','id_curso','id_catedratico','ciclo','anio'];
    for (const k of required) {
      if (req.body[k] === undefined || req.body[k] === null || req.body[k] === '')
        return res.status(400).json({ message: `Falta campo obligatorio: ${k}` });
    }

    req.body.id_alumno = normalizeInt(req.body.id_alumno);
    req.body.id_curso = normalizeInt(req.body.id_curso);
    req.body.id_catedratico = normalizeInt(req.body.id_catedratico);
    req.body.anio = normalizeInt(req.body.anio);

    // Validar FKs
    const [al, cu, ca] = await Promise.all([
      Alumno.findByPk(req.body.id_alumno),
      Curso.findByPk(req.body.id_curso),
      Catedratico.findByPk(req.body.id_catedratico)
    ]);
    if (!al) return res.status(404).json({ message: `No existe alumno id=${req.body.id_alumno}` });
    if (!cu) return res.status(404).json({ message: `No existe curso id=${req.body.id_curso}` });
    if (!ca) return res.status(404).json({ message: `No existe catedrático id=${req.body.id_catedratico}` });

    const created = await Asignacion.create(req.body);

    const withIncludes = await Asignacion.findByPk(created.id_asignacion, {
      include: [
        { model: Alumno, include: [Usuario] },
        { model: Curso },
        { model: Catedratico, include: [Usuario] }
      ]
    });

    return res.status(201).json({
      message: 'Asignación creada con éxito',
      asignacion: toDTO(withIncludes)
    });
  } catch (error) {
    // Conflicto por índice único
    if (error?.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'La asignación ya existe para ese alumno/curso/catedrático/ciclo/año' });
    }
    return res.status(500).json({ message: 'Error!', error: error.message });
  }
};

exports.retrieveAll = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const offset = Number(req.query.offset) || 0;

    // Filtros opcionales
    const where = {};
    if (req.query.id_alumno) where.id_alumno = normalizeInt(req.query.id_alumno);
    if (req.query.id_curso) where.id_curso = normalizeInt(req.query.id_curso);
    if (req.query.id_catedratico) where.id_catedratico = normalizeInt(req.query.id_catedratico);
    if (req.query.ciclo) where.ciclo = String(req.query.ciclo);
    if (req.query.anio) where.anio = normalizeInt(req.query.anio);

    const rows = await Asignacion.findAll({
      where,
      order: [['id_asignacion','ASC']],
      limit, offset,
      include: [
        { model: Alumno, include: [Usuario] },
        { model: Curso },
        { model: Catedratico, include: [Usuario] }
      ]
    });

    return res.status(200).json({
      message: 'OK',
      count: rows.length,
      asignaciones: rows.map(toDTO)
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error!', error: error.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const id = normalizeInt(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: 'id inválido' });

    const row = await Asignacion.findByPk(id, {
      include: [
        { model: Alumno, include: [Usuario] },
        { model: Curso },
        { model: Catedratico, include: [Usuario] }
      ]
    });
    if (!row) return res.status(404).json({ message: `No se encontró asignación con id = ${id}` });

    return res.status(200).json({ message: 'OK', asignacion: toDTO(row) });
  } catch (error) {
    return res.status(500).json({ message: 'Error!', error: error.message });
  }
};

exports.updateById = async (req, res) => {
  try {
    const id = normalizeInt(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: 'id inválido' });

    const row = await Asignacion.findByPk(id);
    if (!row) return res.status(404).json({ message: `No se encontró asignación con id = ${id}` });

    // Validar si cambian FKs
    if (req.body.id_alumno !== undefined) {
      req.body.id_alumno = normalizeInt(req.body.id_alumno);
      const al = await Alumno.findByPk(req.body.id_alumno);
      if (!al) return res.status(404).json({ message: `No existe alumno id=${req.body.id_alumno}` });
    }
    if (req.body.id_curso !== undefined) {
      req.body.id_curso = normalizeInt(req.body.id_curso);
      const cu = await Curso.findByPk(req.body.id_curso);
      if (!cu) return res.status(404).json({ message: `No existe curso id=${req.body.id_curso}` });
    }
    if (req.body.id_catedratico !== undefined) {
      req.body.id_catedratico = normalizeInt(req.body.id_catedratico);
      const ca = await Catedratico.findByPk(req.body.id_catedratico);
      if (!ca) return res.status(404).json({ message: `No existe catedrático id=${req.body.id_catedratico}` });
    }
    if (req.body.anio !== undefined) req.body.anio = normalizeInt(req.body.anio);

    await row.update(req.body);
    await row.reload({
      include: [
        { model: Alumno, include: [Usuario] },
        { model: Curso },
        { model: Catedratico, include: [Usuario] }
      ]
    });

    return res.status(200).json({ message: `Asignación actualizada (id=${id})`, asignacion: toDTO(row) });
  } catch (error) {
    if (error?.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ message: 'Ya existe otra asignación con esos datos (clave compuesta duplicada)' });
    }
    return res.status(500).json({ message: 'Error!', error: error.message });
  }
};

exports.deleteById = async (req, res) => {
  try {
    const id = normalizeInt(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ message: 'id inválido' });

    const row = await Asignacion.findByPk(id, {
      include: [
        { model: Alumno, include: [Usuario] },
        { model: Curso },
        { model: Catedratico, include: [Usuario] }
      ]
    });
    if (!row) return res.status(404).json({ message: `No existe asignación con id = ${id}` });

    await row.destroy();
    return res.status(200).json({ message: `Asignación eliminada (id=${id})`, asignacion: toDTO(row) });
  } catch (error) {
    return res.status(500).json({ message: 'Error!', error: error.message });
  }
};
