// app/config/env.js
const env = {
    database: 'pablonskydb_owc3',
    username: 'pablonsky',
    password: 'aaqAOr1b647vd4TJpQjuxOc7wsDKPqwI',
    host: 'dpg-cr6ejolumphs73co3nng-a.oregon-postgres.render.com',
    dialect: 'postgres',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };
  
  module.exports = env;
  
