const express = require('express');
const app = express();
const _ = require('underscore');


const { responseApi } = require('../constantes/const');
const { verificaToken } = require('../middleware/autenthication');

const Retos = require('../models/retos.model');


app.get('/get-retos', (req, resp) => {

    let response = JSON.parse(responseApi);
    Retos.find((err, retosDB) => {

        if (err) {
            response.Rejected.error.detalle = err;
            return resp.status(500).json(response.Rejected);
        }

        if (!retosDB) {
            response.Accepted.mensaje = "No se encontraron registros";
            response.Accepted.object = [];
            return resp.json(response.Accepted);
        }

        response.Accepted.registros = retosDB.length;
        response.Accepted.object = retosDB;
        return resp.json(response.Accepted);

    })

})


//app.get("/reto/:id", verificaToken, (req, resp) => {

app.get("/reto/:id", (req, resp) => {

    let id = req.params.id;
    let response = JSON.parse(responseApi);

    Retos.findById(id, (err, retoDB) => {

        if (err) {

            response.Rejected.error.detalle = err;
            return resp.status(500).json(
                response.Rejected
            );
        }

        if (!retoDB) {
            response.Accepted.registros = 0;
            return resp.json(
                response.Accepted
            )
        };

        response.Accepted.registros = retoDB.length;
        response.Accepted.object = retoDB

        return resp.json(
            response.Accepted
        )

    })

});

app.get('/retos-min/:id', (req, resp) => {

    let response = JSON.parse(responseApi);
    let id = req.params.id;
    Retos.findById(id, { titulo: 1, icon: 1, descripcion: 1 }, (err, retosDB) => {


        if (err) {
            response.Rejected.error.detalle = err;
            return resp.status(500).json(response.Rejected);
        }

        if (!retosDB) {
            response.Accepted.registros = 0;
            return resp.json(
                response.Accepted
            )
        }

        response.Accepted.registros = retosDB.length;
        response.Accepted.object = retosDB

        return resp.json(
            response.Accepted
        )



    })

});


app.post('/crear-reto', [verificaToken], (req, resp) => {

    let body = _.pick(req.body, ['titulo', 'nivel', 'ranking', 'votos', 'participantes', 'descripcion', 'adicional', 'estado', 'icon', 'miniIcon', 'tips', 'tiempo']);

    let response = JSON.parse(responseApi);

    let reto = new Retos(body);

    reto.save((err, retoDB) => {

        if (err) {
            response.Rejected.error.detalle = err;
            return resp.status(500).json(
                response.Rejected
            )
        }

        if (!retoDB) {
            response.Rejected.error.detalle = "Error al crear el reto, intente nuevamente";
            return resp.status(400).json(
                this.response.Rejected
            )
        }

        response.Accepted.object = retoDB;
        response.Accepted.registros = 1;

        return resp.json(response.Accepted)

    })

});


module.exports = app;