const express = require('express');
const empresaController = require('../controllers/empresa.controller')
const md_autenticacion = require('../middleware/autenticacion')
const crearPDF= require("../controllers/pdf")
const excel = require("../controllers/excel.controller")

const api = express.Router();

//agregar usuarios
api.post('/agregarEmpresa',md_autenticacion.autenticacion,empresaController.agregarEmpresa);
// editar usuario
api.put('/editarEmpresa/:idEmpresa',md_autenticacion.autenticacion,empresaController.editarEmpresa);
// eliminar usuario
api.delete('/eliminarEmpresa/:idEmpresa',md_autenticacion.autenticacion,empresaController.eliminarEmpresa);
// generar pdf
api.get("/generaraPDF",md_autenticacion.autenticacion,crearPDF.empresaGenerar)
//buscar todas las empresas
api.get("/buscarEmpresa",md_autenticacion.autenticacion,empresaController.buscarTodoEmpresa)
// generar excel
api.get("/generarExcel",md_autenticacion.autenticacion,excel.creacionExcel)

module.exports =api;