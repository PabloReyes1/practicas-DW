// MATRIZ: lista alumnos + nota (por curso/grupo/parcial)
exports.matriz = async (req, res) => {
  try {
    const cursoId = toNumber(req.query.cursoId);
    const parcial = (req.query.parcial || 'P1').toString(); // P1|P2|FINAL|RECUP
    const grupo = req.query.grupo;

    if (!Number.isInteger(cursoId)) {
      return res.status(400).json({ message: 'Debe enviar ?cursoId=' });
    }

    const asigWhere = { id_curso: cursoId };
    if (grupo) asigWhere.ciclo = grupo; // usamos "ciclo" como grupo en este diseño

    const asignaciones = await Asignacion.findAll({
      where: asigWhere,
      include: [
        {
          model: Alumno,
          include: [Usuario],
        },
      ],
      order: [[Alumno, 'id_alumno', 'ASC']],
    });

    if (!asignaciones.length) {
      return res.status(200).json({ message: 'Sin asignaciones', parcial, filas: [] });
    }

    const ids = asignaciones.map((a) => a.id_asignacion);

    const notas = await Nota.findAll({
      where: {
        id_asignacion: { [Op.in]: ids },
        etiqueta: parcial,
      },
    });

    const notasMap = new Map();
    notas.forEach((n) => {
      notasMap.set(n.id_asignacion, n);
    });

    const filas = asignaciones.map((a) => {
      const al = a.alumno || a.Alumno;
      const usr = al?.usuario || al?.Usuario;
      const n = notasMap.get(a.id_asignacion);

      return {
        id_asignacion: a.id_asignacion,
        alumno: {
          id_alumno: al?.id_alumno,
          nombre: usr?.nombre || '',
          apellido: usr?.apellido || '',
          codigo: al?.matricula || null,
        },
        nota: n
          ? {
              id_nota: n.id_nota,
              id_asignacion: n.id_asignacion,
              calificacion: Number(n.nota),
              observaciones: n.observaciones || null,
            }
          : null,
      };
    });

    return res.status(200).json({ message: 'OK', parcial, filas });
  } catch (error) {
    return res.status(500).json({ message: 'Error!', error: error.message });
  }
};

// BULK UPSERT: guardar matriz de notas (usa id_asignacion + parcial como clave)
exports.matrizUpsert = async (req, res) => {
  try {
    const rows = Array.isArray(req.body) ? req.body : [];
    if (!rows.length) {
      return res.status(400).json({ message: 'Body debe ser un array de notas' });
    }

    const hoy = normalizeFechaOnly(new Date().toISOString().slice(0, 10));
    let updated = 0;

    for (const r of rows) {
      const id_asignacion = toNumber(r.id_asignacion);
      const parcial = (r.parcial || 'P1').toString();
      const cal = toNumber(r.calificacion);

      if (!Number.isInteger(id_asignacion) || cal == null) continue;

      const asg = await Asignacion.findByPk(id_asignacion);
      if (!asg) continue;

      const [nota, created] = await Nota.findOrCreate({
        where: { id_asignacion, etiqueta: parcial },
        defaults: {
          ponderacion: 100,
          nota: cal,
          fecha_registro: hoy,
          observaciones: r.observaciones || null,
        },
      });

      if (!created) {
        await nota.update({
          nota: cal,
          observaciones: r.observaciones || null,
          fecha_registro: hoy,
        });
      }

      updated++;
    }

    return res.status(200).json({ message: 'Matriz actualizada', updated });
  } catch (error) {
    if (error?.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        message: 'Conflicto de etiqueta dentro de la misma asignación',
      });
    }
    return res.status(500).json({ message: 'Error!', error: error.message });
  }
};

// PUBLICAR: marca como "publicadas" las notas de un curso/parcial (stub seguro)
exports.publicar = async (req, res) => {
  try {
    const cursoId = toNumber(req.body.cursoId);
    const parcial = (req.body.parcial || 'P1').toString();
    const grupo = req.body.grupo;

    if (!Number.isInteger(cursoId)) {
      return res.status(400).json({ message: 'Debe enviar cursoId' });
    }

    const asigWhere = { id_curso: cursoId };
    if (grupo) asigWhere.ciclo = grupo;

    const asignaciones = await Asignacion.findAll({ where: asigWhere });
    const ids = asignaciones.map((a) => a.id_asignacion);

    const count = ids.length
      ? await Nota.count({
          where: { id_asignacion: { [Op.in]: ids }, etiqueta: parcial },
        })
      : 0;

    return res.status(200).json({
      ok: true,
      message: `Publicación registrada para ${count} notas del parcial ${parcial}`,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error!', error: error.message });
  }
};
