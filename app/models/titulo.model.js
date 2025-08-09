module.exports = (sequelize, Sequelize) => {
  const Titulo = sequelize.define('titulo', {
    id_titulo: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: Sequelize.STRING(150),
      allowNull: false
    },
    sinopsis: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    actores: {
      // Guardamos "A,B,C" y en el controlador lo convertimos a array si nos mandan array
      type: Sequelize.TEXT,
      allowNull: false
    },
    duracionMin: {
      type: Sequelize.INTEGER, // duración en minutos
      allowNull: false
    },
    tipo: {
      type: Sequelize.STRING(10), // 'Serie' | 'Película'
      allowNull: false,
      validate: { isIn: [['Serie', 'Película', 'Pelicula']] }
    },
    categoria: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    anio: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    bellako: {
      type: Sequelize.STRING(150),
      allowNull: false
    }
  });

  return Titulo;
};
