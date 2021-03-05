const { response, request } = require('express')

const usuariosGet = (req = request, res = response) => {

    const {q, nombre = 'No name', apikey} = req.query;

    res.json({
        msg: 'get API -controller',
        q,
        nombre,
        apikey
    });

}

const usuariosPut =(req = request, res = response) => {

    const id = req.params.id;

    res.json({
        msg: 'put API -controller',
        id
    });

}

const usuariosPost = (req = request, res = response) => {
    
    const { nombre, edad} = req.body;

    res.json({
        msg: 'post API -controller',
        nombre,
        edad
    });

}

const usuariosDelete = (req = request, res = response) => {
    
    res.json({
        msg: 'delete API -controller'
    });

}

module.exports ={
    usuariosGet,
    usuariosPut,
    usuariosPost,
    usuariosDelete
}