'use strict'
var jwt=require('jwt-simple');
var moment= require('moment');
var secret= 'secret_pass_stud';

exports.createToken=function(user){
    var payload={
        sub:user._id,
        nombre:user.nombre,
        usuario:user.usuario,
        email:user.email,
        rol:user.rol,
        iat:moment().unix(),
        exp:moment().day(30,'days').unix
    }
    return jwt.encode(payload,secret);
}