const { request, response } = require("express")


const esAdminRol = (req = request, res = response, next) => {
    
    if( !req.usuario ){
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin validar el token primero'
        });
    }

    const {rol, nombre } = req.usuario;

    if( rol !== 'ADMIN_ROLE'){
        return res.status(401).json({
            msg: `${nombre} no es administrador - No puede realizar la accion`
        });
    }
    next();
}

const tienRole = ( ...roles ) => {

    return (req = request, res = response, next) => {

        if( !roles.includes( req.usuario.rol) ){
            return res.status(401).json({
                msg: `El servicio requiere uno de estos soles ${roles}`
            });
        }

        next();
    }
}
module.exports = {
    esAdminRol,
    tienRole
}