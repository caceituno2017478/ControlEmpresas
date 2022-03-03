const express = require('express');
const cors = require('cors');
var app = express();

// aqui se importan las rutas
// ejemplo
//const ejemploRutas = require('./src/routers/ejemplo.routes');
const empleadoRutas=require('./src/routers/empleado.routes')
const empresaRutas=require('./src/routers/empresa.routes')
const usuarioRutas=require('./src/routers/usuario.routes')
//middleware
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//cabecera
app.use(cors());

// carga de rutas las
// colocar una, y la ruta

app.use('/api',empleadoRutas,empresaRutas,usuarioRutas);

module.exports = app;