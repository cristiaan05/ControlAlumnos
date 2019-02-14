'use strict'
var express= require('express');
var UserController= require('../controllers/userController');
var md_auth= require('../middlewares/autheticated');

var api= express.Router();

//RUTAS
api.post('/registrar',UserController.registrar);
api.post('/login',UserController.login);


//Exportar
module.exports=api;


