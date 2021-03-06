const express = require('express');
var cors = require('cors')


class Server {

    constructor(){
        this.app = express();
        // puerto donde se ejecutara el sever
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';

        // Middlewares
        this.middlewares();

        // Rutas del servidor (aplicacion)
        this.routes();
    }

    middlewares(){

        //CORS
        this.app.use( cors() );

        // Lectura y parseo del body (recibir datos) cuando reciba info la va a intentar codificar en json
        this.app.use( express.json() );

        // Directorio publico
        this.app.use( express.static('public'));

    }

    routes(){

        this.app.use(this.usuariosPath, require('../routes/usuarios'));
        
    }

    listen(){
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }

}

module.exports = Server;