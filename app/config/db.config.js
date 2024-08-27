// app/config/db.config.js
const env = require('./env.js');
const Sequelize = require('sequelize');
const sequelize = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  dialect: env.dialect,
  dialectOptions:{
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
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


db.Libro = require('../models/libro.model.js')(sequelize, Sequelize);
db.Product = require('../models/product.model.js')(sequelize, Sequelize);
db.Prueba = require('../models/prueba.model.js')(sequelize, Sequelize);
db.Music = require('../models/music.model.js')(sequelize, Sequelize);
db.Usuario = require('../models/usuario.model.js')(sequelize, Sequelize);
db.Mascota = require('../models/mascota.model.js')(sequelize, Sequelize);
db.Cita = require('../models/cita.model.js')(sequelize, Sequelize);
db.Espacio = require('../models/espacio.models.js')(sequelize, Sequelize);
db.ReservaEspacio = require('../models/reservaespacio.model.js')(sequelize, Sequelize);
db.Reserva = require('../models/reserva.model.js')(sequelize, Sequelize);

module.exports = db;
