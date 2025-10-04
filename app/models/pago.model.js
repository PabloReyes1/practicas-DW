// app/models/pago.model.js
module.exports = (sequelize, Sequelize) => {
  const Pago = sequelize.define('pago', {
    id_pago: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_alumno: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    concepto: {
      type: Sequelize.STRING(150),
      allowNull: false
    },
    monto: {
      type: Sequelize.DECIMAL(12,2),
      allowNull: false,
      validate: { min: 0 }
    },
    moneda: {
      // ISO 4217 (GTQ, USD...). No lo limitamos con isIn para permitir flexibilidad.
      type: Sequelize.STRING(3),
      allowNull: false,
      set(val) {
        const v = String(val || '').trim().toUpperCase();
        this.setDataValue('moneda', v.slice(0, 3));
      }
    },
    metodo: {
      // efectivo | tarjeta | transferencia | deposito | cheque | otro
      type: Sequelize.STRING(20),
      allowNull: false,
      set(val) {
        const v = String(val || '').trim().toLowerCase();
        this.setDataValue('metodo', v);
      },
      validate: {
        isIn: [['efectivo','tarjeta','transferencia','deposito','cheque','otro']]
      }
    },
    estado: {
      // pendiente | pagado | anulado
      type: Sequelize.STRING(20),
      allowNull: false,
      set(val) {
        const v = String(val || '').trim().toLowerCase();
        this.setDataValue('estado', v);
      },
      validate: {
        isIn: [['pendiente','pagado','anulado']]
      }
    },
    fecha_pago: {
      type: Sequelize.DATEONLY, // 'YYYY-MM-DD'
      allowNull: false
    },
    referencia: {
      // opcional, pero si se usa puede ser única (boleta, txid, etc.)
      type: Sequelize.STRING(100),
      allowNull: true,
      unique: true
    },
    observaciones: {
      type: Sequelize.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'pagos',
    underscored: true,
    indexes: [
      // Búsquedas rápidas por alumno/fecha/estado
      { fields: ['id_alumno', 'fecha_pago'] },
      { fields: ['estado'] }
    ]
  });

  return Pago;
};
