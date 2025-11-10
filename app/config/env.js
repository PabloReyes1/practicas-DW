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
  },

  stripeSecretKey: 'sk_test_51SRHHr3tmCWydA87Xc8ycOB82tSdNSay2yGKjfyUdvhWdIBA71ZwYCoaKvQvhSkKZb1KriEjI7LLnLH5Y7XcpXQ800ESFevwte',     // ← REEMPLAZA CON TU CLAVE SECRETA REAL (sk_test_)
  stripePublishableKey: 'pk_test_51SRHHr3tmCWydA87O2QpxmX5tfWC8KPbFcHscGoVvScM0DUCTa8i3nR7YW6fYiVxNA1siBW9ZcK8D7NXEheN3odo00d6EWriVQ', // ← OPCIONAL: solo para referencia
  stripeWebhookSecret: 'whsec_TU_CLAVE_WEBHOOK_AQUI' 
};

module.exports = env;
