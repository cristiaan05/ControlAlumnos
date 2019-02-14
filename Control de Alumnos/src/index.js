'use strict'
const mongoose= require("mongoose");
const app= require("./app");

mongoose.Promise=global.Promise;
mongoose.connect('mongodb://localhost:27017/controlAlumnos',{useNewUrlParser:true}).then(()=>{
    console.log('Exito en la conexion hacia la base de datos');

    app.set('port', process.env.PORT || 3001);
    app.listen(app.get('port'),()=>{
        console.log(`Servidor corriendo en puerto:'${app.get('port')}'`);
    })
}).catch(err => console.log(err));