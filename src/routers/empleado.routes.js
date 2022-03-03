const express = require('express');
const empleadoController = require('../controllers/empleado.controller')
const md_autenticacion = require('../middleware/autenticacion')

const api = express.Router();

//agregar usuarios
api.post('/agregarEmpleados',md_autenticacion.autenticacion,empleadoController.agregarUsuario);
// editar usuario
api.put('/editarEmpleados/:idUsuario',md_autenticacion.autenticacion,empleadoController.editarUsuario);
// eliminar usuario
api.delete('/eliminarEmpleados/:idUsuario',md_autenticacion.autenticacion,empleadoController.eliminarUsuario);

// buscar todos 
api.get('/buscar',md_autenticacion.autenticacion,empleadoController.buscarTodo);
//buscar id
api.get('/buscarId/:idEmpleado',md_autenticacion.autenticacion,empleadoController.buscarId);
// buscar nombre
api.get('/buscarNombre',md_autenticacion.autenticacion,empleadoController.buscarNombre);
// buscar puesto
api.get('/buscarPuesto',md_autenticacion.autenticacion,empleadoController.buscarPuesto);
//buscar departamento
api.get('/buscarDepartamento',md_autenticacion.autenticacion,empleadoController.buscarDepartamentos);

//total por empresas
api.get("/buscarTotal",md_autenticacion.autenticacion,empleadoController.totalPorEmpresa)

module.exports =api;