const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/stripe.controller.js');

// Crear PaymentIntent para un pago
router.post('/stripe/create-intent/:id', ctrl.createIntentForPago);

// Fallback para marcar pagado sin webhook
router.post('/stripe/mark-paid', ctrl.markPaid);

// Webhook (recibe eventos de Stripe)
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), ctrl.webhook);

module.exports = router;
