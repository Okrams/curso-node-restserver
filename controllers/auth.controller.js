const { response, request } = require('express');

const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async(req, res) => {

    const {correo, password} = req.body;

    try {

        // Verificar si el email exite
        const usuario = await Usuario.findOne( {correo} );
        if( !usuario ){
            return res.status(400).json({
                msg: 'Usuario / password no son correctos - correo'
            });
        }

        // verifica si el usuario esta activo en DB

        if( !usuario.estado ){
            return res.status(400).json({
                msg: 'Usuario / password no son correctos - estado: false'
            });
        }

        // Verifica la contraseña
        const validPassword = bcryptjs.compareSync( password, usuario.password );
        if( !validPassword ){
            return res.status(400).json({
                msg: 'Usuario / password no son correctos - password'
            });
        }

        // Genera el JWT
        const token = await generarJWT( usuario.id );

        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Algo salio mal, hable con el administrador'
        })
    }
}

const googleSignin = async(req = request, res = response) => {

    const { id_token } = req.body;

    try {
        const {nombre, correo, img} = await googleVerify(id_token);

        let usuario = await Usuario.findOne( {correo} );
        if( !usuario ){
            // tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                google: true
            };
            usuario = new Usuario( data );
            await usuario.save();
        }

        // Si el usuario en BD
        if( !usuario.estado ){
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuario.id );
        
        res.json({
            usuario,
            token
        }); 

    } catch (error) {
        res.status(400).json({
            msg:'Token de Google no válido'
        })
    }

}

module.exports = {
    login,
    googleSignin
}