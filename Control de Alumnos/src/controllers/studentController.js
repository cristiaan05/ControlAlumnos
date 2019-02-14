'use strict'
var bcrypt= require('bcrypt-nodejs');
var Student= require('../models/student');
var jwt= require('../services/jwt');


function updateStudent(req,res) {
    console.log('editar')
    var studentId= req.params.id;
    var params= req.body;
   /* if (studentId != req.student.sub) {
        return res.status(500).send({message:'no tiene los permisos para actualizar este estudiante'});
    }*/

    Student.findByIdAndUpdate(studentId,params,{new:true},(err, studentUpdated)=>{
        if (err) return res.status(500).send({message: 'error en la peticion'});

        if (!studentUpdated) return res.status(404).send({message:'No se ha podido actualizar los datos del estudiante'}); 
        
        return res.status(200).send({student: studentUpdated});
    })
    
}


function addStudent(req,res) {
  //  if (req.user.rol=='professor') {
        var student= new Student();
    var params = req.body;
    if (params.nombre && params.apellido && params.grado && params.clases) {
        student.nombre=params.nombre;
        student.apellido=params.apellido;
        student.grado=params.grado;
        student.clases=params.clases;
        
        Student.find({
            $or:[
                {nombre:student.nombre.toLowerCase()},
                {apellido:student.apellido.toLowerCase()},
                {grado:student.grado.toLowerCase()}
            ]
        }).exec((err,students)=>{
            if(err) return res.status(500).send({message:'Error en la peticion'});
            
            if (students && student.length>=1) {
                return res.status(500).send({message:'El usuario ya existe en el sistema'})
            } else {              
                    student.save((err,studentSaved)=>{
                        if(err) return res.status(500).send({message: 'Error al guardar el usuario'});
    
                        if(studentSaved){
                            res.status(200).send({user:studentSaved});
                        }else{
                            res.status(404).send({message: 'No se ha podido registrar al estudiante'});
                        }
                    })
            }
        
        })
    } else {
        res.status(202).send({
            message:'Rellene todos los campos necesarios'
        })
    }
  //  }else{
    //     res.status(202).send({
    //         message:'No tiene permisos para agregar un estudiante'
    //     })
    // }
    
}

function deleteStudent(req,res) {
    var studentId= req.params.id;
        Student.findByIdAndRemove(studentId,(err,studentDeleted)=>{
            if(err) return res.status(500).send({message: 'Error en la peticion del usuario'});
            if(!studentDeleted) return res.status(404).send({message: 'No se ha podido eliminar el estudiante'});
            var mensaje="Eliminado Usuario con ID: "+ studentId;
            return res.status(202).send(mensaje)
        });
}

function searchStudents(req,res) {
    var nombre=req.params.nombre
            Student.find({nombre:{$regex:"^"+nombre, $options:"i"}},(err,student)=>{
                    if (!student) return res.status(404).send({message:'No se ha encontrado ningun estudiante'})
                    if(err){
                        return res.status(500).send({message: 'Error con el metodo de busqueda'})
                     }else{
                         return res.status(200).send({Estudiantes:student});
                     }
                
            })         
}

function  addClass(req, res){
    var studentId=req.params.id;
    var clase=req.body.clases;
    var asignar='si'
    Student.findById(studentId,(err,studentClass)=>{
        if(err) return res.status(500).send({message:'Error en la peticion'});
        if(!studentClass) return res.status(404).send({message:'Error fatal verifique el ID del alumno'})
        if(studentClass.clases){
            studentClass.clases.forEach(i => {
                if((i).toLowerCase() === (clase).toLowerCase()){
                    asignar='no'
                    return res.status(500).send({message:'La clase ya esta asignada'})
                }
                else{
                    asignar='si'  
                }
            });
        }
        
        if (asignar=='si') {   
                studentClass.clases.push(clase);
                Student.findByIdAndUpdate(studentId,studentClass,{new:true}, (err,studentUpdated)=>{
                    if(err) return res.status(500).send({message:'error en la peticion'});
            
                    if(!studentUpdated) return res.status(404).send({message: 'No se ha podido agregar la clase'});
                    return res.status(200).send({Student: studentUpdated});
                });
               
        }
       
    })
}

module.exports={
    updateStudent,
    addStudent,
    deleteStudent,
    searchStudents,
    addClass
}