'use strict'
var bcrypt= require('bcrypt-nodejs');
var User= require('../models/user');
var jwt= require('../services/jwt');


function registrar(req,res) {
        var user= new User();
        var params=req.body;
        if (params.usuario && params.email && params.password) {
            user.nombre = params.nombre;
            user.usuario=params.usuario;
            user.email=params.email;
            user.password=params.password;
            user.rol='professor'

            User.find({
                $or:[
                    {email: user.email.toLowerCase()},
                    {email: user.email.toUpperCase()},
                    {usuario:user.usuario.toLowerCase()},
                    {usuario:user.usuario.toUpperCase()}
                ]
            }).exec((err,users)=>{
                if(err) return res.status(500).send({message:'Error en la peticion del usuario'});

                if (users && user.length>=1) {
                    return res.status(500).send({message:'El usuario ya existe en el sistema'})
                } else {
                    bcrypt.hash(params.password,null,null,(err,hash)=>{
                        user.password=hash;
                        
                        user.save((err,userSaved)=>{
                            if(err) return res.status(500).send({message: 'Error al guardar el usuario'});

                            if(userSaved){
                                res.status(200).send({user:userSaved});
                            }else{
                                res.status(404).send({message: 'No se ha podido registrar al usuario'});
                            }
                        })
                    })
                }
            })
        } else {
            res.status(202).send({
                message:'Rellene todos los campos necesarios'
            })
        }
}

function login(req,res) {
    var params = req.body;
    var email = params.email;
    var password = params.password;

    User.findOne({ email: email }, (err, user) => {
        if (err) return res.status(500).send({ message: 'Error de la petición' })
        if (user) {
            bcrypt.compare(password, user.password, (err, check) => {
                if (check) {
                    if (params.gettoken) {
                        return res.status(200).send({
                            token: jwt.createToken(user)
                        })
                    } else {
                        user.password = undefined;
                        return res.status(200).send({ user })
                    }
                } else {
                    return res.status(404).send({ message: 'El usuario no se ha podido identificar' })
                }
            })
        } else {
            return res.status(404).send({ message: 'El usuario no se ha podido loggear' })
        }
    })
}

module.exports={
    registrar,
    login
}