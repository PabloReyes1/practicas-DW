// app/controllers/stripe.controller.js
const db = require('../config/db.config.js');
const PagoMatricula = db.PagoMatricula;
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || require('../config/env.js').stripeSecretKey);

const toMoneyInt = (m) => Math.round(Number(m) * 100); // 350.75 -> 35075

// Crea PaymentIntent para un pago existente (por id)
exports.createIntentForPago = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const pago = await PagoMatricula.findByPk(id);
    if (!pago) return res.status(404).json({ message: `Pago id=${id} no existe` });

    // Monto en centavos/menor unidad (GTQ -> define tu currency)
    const amount = toMoneyInt(pago.monto);
    const currency = 'gtq'; // usa 'usd' si lo deseas

    const intent = await stripe.paymentIntents.create({
      amount,
      currency,
      description: `Matrícula ${pago.carnet} - ${pago.estudiante} (${pago.mes} ${pago.anio})`,
      metadata: {
        pagoId: String(pago.id_pago),
        carnet: pago.carnet,
        estudiante: pago.estudiante
      },
      automatic_payment_methods: { enabled: true }
    });

    // Guarda el intent id tentativamente
    await pago.update({ transactionStripe: intent.id, statusStripe: 'pendiente' });

    return res.status(200).json({ clientSecret: intent.client_secret, intentId: intent.id });
  } catch (error) {
    return res.status(500).json({ message: 'Error creando PaymentIntent', error: error.message });
  }
};

// Marcar pagado (fallback si no usas webhook)
exports.markPaid = async (req, res) => {
  try {
    const { pagoId, paymentIntentId } = req.body;
    const pago = await PagoMatricula.findByPk(Number(pagoId));
    if (!pago) return res.status(404).json({ message: 'Pago no encontrado' });

    // Verifica en Stripe
    const pi = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (pi.status !== 'succeeded') {
      return res.status(400).json({ message: `El PaymentIntent no está 'succeeded' (status=${pi.status})` });
    }

    await pago.update({ transactionStripe: pi.id, statusStripe: 'pagado' });
    return res.status(200).json({ message: 'Pago marcado como pagado', pago: pago.toJSON() });
  } catch (error) {
    return res.status(500).json({ message: 'Error marcando pagado', error: error.message });
  }
};


exports.webhook = async (req, res) => {
  let event = req.body;

 
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || require('../config/env.js').stripeWebhookSecret;
  if (webhookSecret) {
    const sig = req.headers['stripe-signature'];
    try {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
  }

  try {
    if (event.type === 'payment_intent.succeeded') {
      const pi = event.data.object;
      const pagoId = pi.metadata?.pagoId ? Number(pi.metadata.pagoId) : null;
      if (pagoId) {
        const pago = await db.PagoMatricula.findByPk(pagoId);
        if (pago) await pago.update({ transactionStripe: pi.id, statusStripe: 'pagado' });
      }
    }
    return res.json({ received: true });
  } catch (error) {
    return res.status(500).json({ message: 'Error procesando webhook', error: error.message });
  }
};
