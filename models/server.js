const express = require('express');
var cors = require('cors');
const { dbConnection } = require('../database/config');


class Server {

    constructor(){
        this.app = express();
        // puerto donde se ejecutara el sever
        this.port = process.env.PORT;
        this.usuariosPath = '/api/usuarios';
        this.authPath = '/api/auth';

        // Conectar a base de datos
        this.connectarDb();
        
        // Middlewares
        this.middlewares();

        // Rutas del servidor (aplicacion)
        this.routes();
    }

    async connectarDb(){

        await dbConnection();

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

        this.app.use(this.authPath, require('../routes/auth'));
        this.app.use(this.usuariosPath, require('../routes/usuarios'));

    }

    listen(){
        this.app.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port);
        });
    }

}

module.exports = Server;