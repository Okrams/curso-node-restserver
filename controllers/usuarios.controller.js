const { response, request } = require('express');
const bcryptjs = require('bcryptjs');


const Usuario = require('../models/usuario');
const { validate } = require('../models/usuario');


const usuariosGet = async(req = request, res = response) => {

    // const usuarios = await Usuario.find(); // devuelve todos los regustros
    let { limite = 5, desde = 0 } = req.query;
    // ({ key: value }) es una condición 
    const query = { estado: true };
    
    /* Verificación de los args */
    limite = Number.parseInt(limite, 10);
    if( Number.isNaN(limite) ){
        limite = 5;
    }
    desde = Number.parseInt(desde, 10);
    if( Number.isNaN(desde) ){
        desde = 0;
    }

    // Son 2 promesas pero primero se ejecuta una y hasta que termine se ejecuta la otra
    // const usuarios = await Usuario.find(query)
    //     .skip( desde )
    //     .limit( limite );
    // const total = await Usuario.countDocuments(query);    

    const [ total, usuarios ] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip( desde )
            .limit( limite )
    ])

    res.json({
        total,
        usuarios
    });

}

const usuariosPut = async(req = request, res = response) => {

    const { id } = req.params;
    const { _id, password, google, correo, ...resto } = req.body;

    if( password ){
        // Encriptar la contraseña
        const salt = bcryptjs.genSaltSync(); // verificar bcryptjs
        resto.password = bcryptjs.hashSync( password, salt);
    }

    const usuario = await Usuario.findByIdAndUpdate( id, resto );

    res.json(usuario);

}

const usuariosPost = async(req = request, res = response) => {
    
    const { nombre, correo, password, rol } = req.body;
    const usuario = new Usuario( {nombre, correo, password, rol} );

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync(); // verificar bcryptjs
    usuario.password = bcryptjs.hashSync( password, salt);

    // Guardar en DB
    await usuario.save();

    res.json({
        msg: 'post API -controller',
        usuario
    });

}

const usuariosDelete = async(req = request, res = response) => {
    
    const { id } = req.params;

    // Fisicamente lo borramos
    // const usuario = await Usuario.findByIdAndDelete( id );

    const usuaro = await Usuario.findByIdAndUpdate( id, { estado: false});    

    res.json(
        usuario
    );

}

module.exports ={
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete
}