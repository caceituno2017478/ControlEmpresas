const jwt_simple = require('jwt-simple');
const moment = require('moment');
const secret = 'clave-secreta-empresa';

exports.crearToken= function(usuario){
    let payload={
        sub:usuario._id,
        nombre: usuario.nombre,
        empresa: usuario.empresa,
        rol:usuario.rol,
        gmail: usuario.gmail,

        iat:moment().unix(),
        exp: moment().day(7,'day').unix()
    }
    return jwt_simple.encode(payload, secret)
}