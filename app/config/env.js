// app/config/env.js
const env = {
    database: 'pablonskydb',
    username: 'pablosnky',
    password: 'AKQQRoMn2yvITKWc6KG9kiLllt1PlScT',
    host: 'dpg-cqin6b2j1k6c739hkahg-a.oregon-postgres.render.com',
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };
  
  module.exports = env;
  