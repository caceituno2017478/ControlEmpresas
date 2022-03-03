const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var EmpresaSchema = Schema({
    empresa:String,
    direccion:String,
    gmail:String,
    password:String,
    rol: String
})

module.exports = mongoose.model("empresas",EmpresaSchema)