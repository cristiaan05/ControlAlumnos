'use strict'
 var mongoose=require('mongoose');
 var Schema= mongoose.Schema;

 var StudentSchema=Schema({
     nombre:String,
     apellido:String,
     grado:String,
     clases:[String]
 })

 module.exports = mongoose.model('Student',StudentSchema);