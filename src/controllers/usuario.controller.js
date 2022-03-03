const Usuario = require("../models/usuario.model")
const Empresa = require("../models/empresa.model")
const bcrypt = require("bcrypt-nodejs");
const jwt = require("../services/jwt")

// Login
function login(req, res) {
    var parametros = req.body;

    Usuario.findOne({ gmail: parametros.gmail }, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: "Error,nose a podido resolver la consulta" });
        if (usuarioEncontrado !== null) {
            bcrypt.compare(parametros.password, usuarioEncontrado.password, (err, vertifiacionPassword) => {
                if (vertifiacionPassword!== null) {

                    if (parametros.obtenerToken === 'true') {
                        return res.status(200).send({token: jwt.crearToken(usuarioEncontrado)})

                    } else {
                        usuarioEncontrado.password = undefined;
                        return res.status(200).send({ usuario: usuarioEncontrado });
                    }
                } else {
                    return res.status(500).send({ mensaje: "La contraseña es incorrecta" });
                }
            })
        } else {
            Empresa.findOne({ gmail: parametros.gmail }, (err, usuarioEncontrado) => {
                if (err) return res.status(500).send({ mensaje: "Error,nose a podido resolver la consulta" });
                if (usuarioEncontrado) {
                    bcrypt.compare(parametros.password, usuarioEncontrado.password, (err, vertifiacionPassword) => {
                        if (vertifiacionPassword) {
        
                            if (parametros.obtenerToken === 'true') {
                                return res.status(200).send({token: jwt.crearToken(usuarioEncontrado)})
        
                            } else {
                                usuarioEncontrado.password = undefined;
                                return res.status(200).send({ usuario: usuarioEncontrado });
                            }
                        } else {
                            return res.status(500).send({ mensaje: "La contraseña es incorrecta" });
                        }
                    })
                } else {
                    return res.status(500).send({ mensaje: "El usuario no ha podido identificar" });
                }
            })
            }

    } )

}

module.exports = {
    login
}