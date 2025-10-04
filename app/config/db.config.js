// app/config/db.config.js
const env = require('./env.js');
const { Sequelize } = require('sequelize');

// Puedes controlar SSL y logging desde env.js
const sequelize = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  port: env.port,                 // opcional si lo tienes en env
  dialect: env.dialect,           // 'postgres' | 'mysql' | 'mssql' | etc.
  logging: env.logging ?? false,  // true/false según quieras ver SQL en consola
  dialectOptions: env.dialectOptions ?? {
    // Si tu proveedor requiere SSL (ej. Render/Neon/Heroku), deja esto activo
    ssl: env.ssl ? { require: true, rejectUnauthorized: false } : undefined
  },
  pool: {
    max: env.pool.max,
    min: env.pool.min,
    acquire: env.pool.acquire,
    idle: env.pool.idle,
  }
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// ===== Registro de modelos =====
db.Usuario      = require('../models/usuario.model.js')(sequelize, Sequelize);
db.Alumno       = require('../models/alumno.model.js')(sequelize, Sequelize);
db.Catedratico  = require('../models/catedratico.model.js')(sequelize, Sequelize);
db.Curso        = require('../models/curso.model.js')(sequelize, Sequelize);
db.Asignacion   = require('../models/asignacion.model.js')(sequelize, Sequelize);
db.Nota         = require('../models/nota.model.js')(sequelize, Sequelize);
db.Pago         = require('../models/pago.model.js')(sequelize, Sequelize);

// Tu modelo de ejemplo inicial (películas/series)
db.Titulo       = require('../models/titulo.model.js')(sequelize, Sequelize);

// ===== Asociaciones =====

// Usuario 1:1 Alumno
db.Usuario.hasOne(db.Alumno, {
  foreignKey: { name: 'id_usuario', allowNull: false },
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});
db.Alumno.belongsTo(db.Usuario, { foreignKey: 'id_usuario' });

// Usuario 1:1 Catedratico
db.Usuario.hasOne(db.Catedratico, {
  foreignKey: { name: 'id_usuario', allowNull: false },
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});
db.Catedratico.belongsTo(db.Usuario, { foreignKey: 'id_usuario' });

// Curso 1:N Asignacion
db.Curso.hasMany(db.Asignacion, {
  foreignKey: { name: 'id_curso', allowNull: false },
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});
db.Asignacion.belongsTo(db.Curso, { foreignKey: 'id_curso' });

// Alumno 1:N Asignacion
db.Alumno.hasMany(db.Asignacion, {
  foreignKey: { name: 'id_alumno', allowNull: false },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
db.Asignacion.belongsTo(db.Alumno, { foreignKey: 'id_alumno' });

// Catedratico 1:N Asignacion
db.Catedratico.hasMany(db.Asignacion, {
  foreignKey: { name: 'id_catedratico', allowNull: false },
  onDelete: 'RESTRICT',
  onUpdate: 'CASCADE'
});
db.Asignacion.belongsTo(db.Catedratico, { foreignKey: 'id_catedratico' });

// Asignacion 1:N Nota
db.Asignacion.hasMany(db.Nota, {
  foreignKey: { name: 'id_asignacion', allowNull: false },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
db.Nota.belongsTo(db.Asignacion, { foreignKey: 'id_asignacion' });

// Alumno 1:N Pago
db.Alumno.hasMany(db.Pago, {
  foreignKey: { name: 'id_alumno', allowNull: false },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
db.Pago.belongsTo(db.Alumno, { foreignKey: 'id_alumno' });

// (Titulo no tiene asociaciones con el resto; se deja independiente)

module.exports = db;
