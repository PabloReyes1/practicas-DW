// server.js
const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cors = require('cors');

const db = require('./app/config/db.config.js');
db.sequelize.sync({ force: true }).then(() => {
  console.log('Drop and Resync with { force: true }');
});

const tituloRouter = require('./app/routers/titulo.router.js');
const usuarioRouter = require('./app/routers/usuario.router.js');
const alumnoRouter = require('./app/routers/alumno.router.js');
const catedraticoRouter = require('./app/routers/catedratico.router.js');
const cursoRouter = require('./app/routers/curso.router.js');
const asignacionRouter = require('./app/routers/asignacion.router.js');
const notaRouter = require('./app/routers/nota.router.js');
const pagoRouter = require('./app/routers/pago.router.js');



app.use(cors());
app.use(bodyParser.json());
app.use('/', tituloRouter);
app.use('/', usuarioRouter);
app.use('/', alumnoRouter);
app.use('/', catedraticoRouter);
app.use('/', cursoRouter);
app.use('/', asignacionRouter);
app.use('/', notaRouter);
app.use('/', pagoRouter);


app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Product API" });
});

// Create a Server
const server = app.listen(8080, function () {
  let host = server.address().address
  let port = server.address().port
  console.log("App listening at http://%s:%s", host, port); 
});
