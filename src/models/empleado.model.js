const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var EmpleadoSchema = Schema({
    nombre:String,
    apellido:String,
    puesto: String,
    departamento:String,
    rol: String,
    empresa:String
})

module.exports = mongoose.model("empleado",EmpleadoSchema)