// app/config/env.js
const env = {
  database: 'neondb',
  username: 'neondb_owner',
  password: 'npg_krJnSM39GNdc',
  host: 'ep-gentle-surf-aftsc0p4-pooler.c-2.us-west-2.aws.neon.tech',
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

module.exports = env;
