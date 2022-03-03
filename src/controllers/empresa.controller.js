const Empresa = require("../models/empresa.model");
const Empleados = require("../models/empleado.model");
const bcrypt = require("bcrypt-nodejs");


//agregar

function agregarEmpresa(req, res){
    if(req.user.rol === "administrador"){
        var parametros = req.body;
        var empresaModel = new Empresa();

        if(parametros.empresa && parametros.direccion && parametros.gmail && parametros.password){
            empresaModel.empresa = parametros.empresa;
            empresaModel.direccion = parametros.direccion;
            empresaModel.gmail = parametros.gmail;
            empresaModel.rol = "empresa"

            Empresa.findOne({empresa: parametros.empresa, gmail: parametros.gmail}, (err, nombreEncontrado)=>{
                if(err) return res.status(500).send({ mensaje:"Error en la peticion"})
                if(nombreEncontrado !== null){
                    return res.status(500).send({ mensaje: "El correo o nombre ya existe"}) 
                }else{
                    bcrypt.hash(parametros.password , null, null ,(err, passwordEncrypt)=>{
                        empresaModel.password = passwordEncrypt;

                        empresaModel.save((err,usuarioGuardado)=>{
                            if(err) return res.status(500).send({ mensaje:"Error en la peticion"})
                            if(!usuarioGuardado) return res.status(404).send({ mensaje:"Error al agregar el usuario"})
            
                            return res.status(200).send({ empresa: usuarioGuardado })
                        });
                    })
                }
            })
        }else{
            return res.status(500).send({ mensaje: "Campos incompletos"})
        }

    }else{
        return res.status(500).send({ mensaje: "No posee los permisos necesarios"})
    }
    
}

//modificar

function editarEmpresa(req, res){
    var  idEmp= req.params.idEmpresa;
    var parametros= req.body;

    if(req.user.rol === "administrador"){
        if(parametros.password || parametros.rol || parametros.gmail){
            return res.status(500).send({ mensaje: "No posees autorizacion para editar esos parametros"})
        }else{
            Empresa.findOne({empresa: parametros.empresa},(err,nombreEncontrado)=>{
                if(err) return res.status(500).send({mensaje:"Error en la peticion"})
                if(nombreEncontrado === null){
                    
                    Empresa.findById(idEmp,(err, empresaEncontrada)=>{
                        if(err) return res.status(500).send({ mensaje:"Error en la peticion"})
                        if(empresaEncontrada !== null){
                            
                            if(parametros.empresa !== null){
                                Empleados.updateMany({empresa: empresaEncontrada.empresa},{empresa: parametros.empresa},(err,usuarioActualizado)=>{
                                    if(err) return res.status(500).send({ mensaje:"Error en la peticion"})
                                    if(!usuarioActualizado) return res.status(404).send({ mensaje:"Error al editar el usuario"})
                        
                                    Empresa.findByIdAndUpdate(idEmp,parametros,{new: true},(err,usuarioActualizado)=>{
                                        if(err) return res.status(500).send({ mensaje:"Error en la peticion"})
                                        if(!usuarioActualizado) return res.status(404).send({ mensaje:"Error al editar el usuario"})
                        
                                        return res.status(200).send({empresa: usuarioActualizado})
                                    })
        
                                })
                            }else{
                                Empresa.findByIdAndUpdate(idEmp,parametros,{new: true},(err,usuarioActualizado)=>{
                                    if(err) return res.status(500).send({ mensaje:"Error en la peticion"})
                                    if(!usuarioActualizado) return res.status(404).send({ mensaje:"Error al editar el usuario"})
                    
                                    return res.status(200).send({empresa: usuarioActualizado})
                                })
                            }
                        }else{
                            return res.status(404).send({mensaje:"La empresa ingresada no es correcta"})
                        }
                    })
                            
                }else{
                    return res.status(500).send({ mensaje: "Nombre de le empresa ya existe"})
                }
            })
        }
    }else{
        return res.status(500).send({ mensaje: "Solo el administrador puede editar"})
    }
}

//eliminar
function eliminarEmpresa(req, res){
    
    if(req.user.rol === "administrador"){
        registrar();
        var idEmp = req.params.idEmpresa
        Empresa.findById(idEmp,(err, existeEmpresa) => {
            if(err) return res.status(500).send({ mensaje:"Error en la peticion existe empresa"})
            if(existeEmpresa=== null) return res.status(404).send({ mesaje:"La empresa buscada no existe" })
            Empresa.findOne({ empresa: "default" }, (err, empresaModificar) => {
                if(err) return res.status(500).send({ mensaje:"Error en la peticion existe default"})
                if(empresaModificar !== null){
                    Empleados.updateMany({ empresa: existeEmpresa.empresa},{ empresa: empresaModificar.empresa},
                        (err, editarEmpresa)=>{
                            if(err) return res.status(500).send({ mensaje:"Error en la peticion"})
                            if(editarEmpresa !== null){
                                Empresa.findByIdAndDelete(idEmp,(err,usuarioEliminado)=>{
                                    if(err) return res.status(500).send({ mensaje:"Error en la peticion"})
                                    if(!usuarioEliminado) return res.status(404).send({ mensaje:"Error al eliminar el usuario"})
                                    return res.status(200).send({empresa: usuarioEliminado})
                                })
                            }
                    })
                }
            })

        })         
    }else{
        return res.status(404).send({mensaje:"No posee los permisos necesarios"})
    }
}

// falta agregarle el password
function registrar(){
    Empresa.findOne({ gmail: "default@gmail.com" }, (err, empresaDefault) => {
        if(err) return res.status(500).send({ mensaje:"Error en la peticion existe default"})
        if(empresaDefault === null){
            var empresaModel = new Empresa();
            empresaModel.empresa = "default";
            empresaModel.direccion = "18, avenida 0, guatemala";
            empresaModel.gmail = "default@gmail.com";
            empresaModel.rol = "empresa"
            bcrypt.hash("123456", null, null ,(err, passwordEncrypt)=>{
                empresaModel.password = passwordEncrypt;
                empresaModel.save((err,usuarioGuardado)=>{
                
                })
            })
        }
    })
}


// buscar todos los campos

function buscarTodoEmpresa(req, res){
    if(req.user.rol === "administrador"){
        Empresa.find((err, empresaEncontrado)=>{
            if(err) return res.status(500).send({ mensaje:"Error en la peticion"})
            return res.status(200).send({empresa: empresaEncontrado}) 
        })
    }else{
        return res.status(500).send({ mensaje: "No posees los permisos necesarios"})
    }
}




module.exports={
    agregarEmpresa,
    editarEmpresa,
    eliminarEmpresa,
    buscarTodoEmpresa
}