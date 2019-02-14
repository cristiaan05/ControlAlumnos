'use strict'
var express= require('express');
var StudentController= require('../controllers/studentController');
var md_auth= require('../middlewares/autheticated');

var api= express.Router();

//RUTAS
api.post('/addStudent',md_auth.ensureAuth,StudentController.addStudent);
api.put('/updateStudent/:id', md_auth.ensureAuth, StudentController.updateStudent);
//api.put('/edit/:id',md_auth.ensureAuth, StudentController.updateStudent);
api.delete('/deleteStudent/:id',md_auth.ensureAuth,StudentController.deleteStudent);
api.get('/search/:nombre',md_auth.ensureAuth,StudentController.searchStudents)
api.put('/addClass/:id',md_auth.ensureAuth,StudentController.addClass)

//Exportar
module.exports=api;
