module.exports = (sequelize, Sequelize) => {
  const PagoMatricula = sequelize.define('pago_matricula', {
    id_pago: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    carnet: {
      type: Sequelize.STRING(20),
      allowNull: false
    },
    estudiante: {
      type: Sequelize.STRING(150),
      allowNull: false
    },
    mes: {
      type: Sequelize.STRING(20),
      allowNull: false
    },
    semestre: {
      type: Sequelize.STRING(10),
      allowNull: false
    },
    anio: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    monto: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false
    },
    transactionStripe: {
      type: Sequelize.STRING(150),
      allowNull: true
    },
    statusStripe: {
      type: Sequelize.ENUM('pendiente', 'pagado', 'fallido'),
      defaultValue: 'pendiente'
    }
  }, {
    tableName: 'pagos_matricula',
    underscored: true
  });

  return PagoMatricula;
};
