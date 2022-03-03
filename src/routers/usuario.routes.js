const express = require('express');
const usuarioController = require('../controllers/usuario.controller')

const api = express.Router();

// login 
api.post('/login', usuarioController.login);

module.exports =api;