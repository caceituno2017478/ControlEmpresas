const Empleado = require("../models/empleado.model")


//agregar

function agregarUsuario(req, res){
    
    if(req.user.rol === "empresa"){
        var parametros = req.body;
        var empleadoModel = new Empleado();

        if(parametros.nombre&&parametros.apellido&& parametros.puesto && parametros.departamento){
            empleadoModel.nombre = parametros.nombre;
            empleadoModel.apellido = parametros.apellido;
            empleadoModel.puesto= parametros.puesto;
            empleadoModel.departamento= parametros.departamento;
            empleadoModel.empresa = req.user.empresa;

            Empleado.find({nombre: parametros.nombre, empresa: req.user.empresa}, (err, empleadoEncontrado)=>{
                if(err) return res.status(500).send({ mensaje:"Error en la peticion"})
                if(empleadoEncontrado.length !== 0) {
                    empleadoEncontrado.forEach(element=>{
                        if(element.nombre === parametros.nombre && element.apellido === parametros.apellido 
                            && element.departamento === parametros.departamento 
                            && element.puesto === parametros.puesto){
                                return res.status(500).send({ mensaje: "El empleado ya existe"}) 
                        }
                    })
                }else{
                    empleadoModel.save((err,usuarioGuardado)=>{
                        if(err) return res.status(500).send({ mensaje:"Error en la peticion"})
                        if(!usuarioGuardado) return res.status(404).send({ mensaje:"Error al agregar el usuario"})

                        return res.status(200).send({ empresa: usuarioGuardado })
                    });
                }
            })
        }else{
            return res.status(500).send({ mensaje: "Campos incompletos"})
        }
    }else{
        return res.status(500).send({ mensaje: "No tiene los permisos necesarios"})
    }
}

//modificar

function editarUsuario(req, res){
    var idUser = req.params.idUsuario;
    var parametros= req.body;
    if(req.user.rol === "empresa"){
        
            Empleado.find({_id: idUser, empresa: req.user.empresa},(err, empresaEncontrada)=>{
                if(err) return res.status(500).send({ mensaje:`Error en la peticion ${err}`})
                if(empresaEncontrada.length === 0) return res.status(500).send({ mensaje: "Ese empleado no pertenece a tu empresa"})
                empresaEncontrada.forEach(element=>{
                    if(element.nombre === parametros.nombre){
                        return res.status(500).send({mensaje: "Este nombre ya se a asignado"})
                    }else{
                        if(empresaEncontrada !== null){
                            Empleado.findByIdAndUpdate(idUser,parametros,{new: true},(err,empresaActualizado)=>{
                                if(err) return res.status(500).send({ mensaje:"Error en la peticion"})
                                if(!empresaActualizado) return res.status(404).send({ mensaje:"Error al actlizar, revisasr el token"})
                    
                                return res.status(200).send({empresa: empresaActualizado})
                            })
                        }else{
                            return res.status(500).send({ mensaje: "Solo puedes editar empleados de tu misma empresa"})
                        }
                    }
                })
                
            })
        
    }else{
        return res.status(500).send({ mensaje: "Solo el administrador puede editar"})
    }
}

//eliminar
function eliminarUsuario(req, res){
    if(req.user.rol === "empresa"){
        var idUser = req.params.idUsuario;
        
        Empleado.findById(idUser, (err, usuarioEncontrado) => {
            if(err) return res.status(500).send({ mensaje:"Error en la peticion"})
            if(usuarioEncontrado!== null){
                if(req.user.empresa === usuarioEncontrado.empresa){
                    Empleado.findByIdAndDelete(idUser,(err,empleadoEliminado)=>{
                        if(err) return res.status(500).send({ mensaje:"Error en la peticion"})
                        if(!empleadoEliminado) return res.status(404).send({ mensaje:"Error al eliminar el usuario"})
                        return res.status(200).send({empresa: empleadoEliminado})
                    })
                }else{
                    return res.status(500).send({ mensaje: "Solo puedes eliminar empleados de tu misma empresa"})
                }
            }else{
                return res.status(500).send({ mensaje: "Empleado a eliminar no existe"})
            }

        })
                   
    }else{
        return res.status(500).send({ mensaje: "No posees los permisos necesarios"})
    }
}

// buscar todos los campos

function buscarTodo(req, res){
    if(req.user.rol === "empresa"){
        Empleado.find({empresa:req.user.empresa}, (err, usuarioEncontrado) => {
            if(err) return res.status(500).send({ mensaje:`Error en la peticion ${err}`})
            if(usuarioEncontrado !== null){
                return res.status(200).send({empresa: usuarioEncontrado})
            }
        })
    }else{
        return res.status(500).send({ mensaje: "No posees los permisos necesarios"})
    }    
}

//buscar por id
function buscarId(req, res) {
    if(req.user.rol === "empresa"){
        var idUser = req.params.idEmpleado;
        Empleado.find({_id:idUser,empresa: req.user.empresa},(err,perteneceEmpresa)=>{
            if(err) return res.status(500).send({ mensaje:`Error en la peticion ${err}`})
            if(perteneceEmpresa.length === 0) return res.status(500)
            .send({mensaje: "No puedes buscar empleados de otra empresa"})
            return res.status(200).send({empleado: perteneceEmpresa})
        })
    } else{
        return res.status(500).send({ mensaje: "No posees los permisos necesarios"})
    }
}

//  buscar por nombre
function buscarNombre(req, res){
    if(req.user.rol === "empresa"){
        var parametros = req.body;
        
        Empleado.find({nombre: parametros.nombre, empresa: req.user.empresa},(err, empleadoEncontrado)=>{
            if(err) return res.status(500).send({ mensaje:`Error en la peticion ${err}`})
            if(empleadoEncontrado.length === 0) return res.status(404).send({ mensaje:"El usuario no existe en esa empresa"})
            return res.status(200).send({empresa: empleadoEncontrado}) 
            
        })
    }else{
        return res.status(500).send({ mensaje: "No posees los permisos necesarios"})
    }
}

// buscar por puesto

function buscarPuesto(req, res){
    if(req.user.rol === "empresa"){
        var params = req.body;
        Empleado.find({puesto: params.puesto, empresa: req.user.empresa},(err,empleadoEncontrado)=>{
            if(err) return res.status(500).send({ mensaje:"Error en la peticion"})
            if(empleadoEncontrado.length === 0) return res.status(404).send({ mensaje:"No hay esos puestos en esa empresa"})
            return res.status(200).send({empresa: empleadoEncontrado}) 
            
        })
    }else{
        return res.status(500).send({ mensaje: "No posees los permisos necesarios"})
    }
}

// buscar por departamentos
function buscarDepartamentos(req, res){
    if(req.user.rol === "empresa"){
        var parametros = req.body;
        Empleado.find({departamento: parametros.departamento, empresa: req.user.empresa},(err, empleadoEncontrado)=>{
            if(err) return res.status(500).send({ mensaje:"Error en la peticion"})
            if(empleadoEncontrado.length === 0) return res.status(404).send({ mensaje:"Ese departamento no existe en esa empresa"})
            return res.status(200).send({empresa: empleadoEncontrado}) 
        })
    }else{
        return res.status(500).send({ mensaje: "No posees los permisos necesarios"})
    }
}

//buscar total empresa
function totalPorEmpresa(req, res){
    if(req.user.rol === "empresa"){
        Empleado.find({empresa:req.user.empresa}, (err, empleadoEmpresa) => {
            if(err) return res.status(500).send({ mensaje:"Error en la peticion"})
            if(empleadoEmpresa.length !== 0) {
                return res.status(200).send({empresa: "Empresa: "+   req.user.empresa+"  "+"Empleados: "+ empleadoEmpresa.length})
            }else{
                return res.status(500).send({ mensaje: "No pertenece ningun empleado a esa empresa"})
            }
        })
    }else{
        return res.status(500).send({ mensaje: "No posees los permisos necesarios"})
    }
}


// exportaciones
module.exports = {
    agregarUsuario,
    editarUsuario,
    eliminarUsuario,
    buscarTodo,
    buscarId,
    buscarDepartamentos,
    buscarNombre,
    buscarPuesto,
    totalPorEmpresa
}