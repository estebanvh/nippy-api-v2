const express = require('express');
const app = express();
const _ = require('underscore');


const { responseReto } = require('../constantes/const');
const { verificaToken } = require('../middleware/autenthication');

const Retos = require('../models/retos.model');

//app.get("/reto/:id", verificaToken, (req, resp) => {

app.get("/reto/:id", (req, resp) => {

    let id = req.params.id;
    let response = JSON.parse(JSON.stringify(responseReto));

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
        response.Accepted.reto = retoDB

        return resp.json(
            response.Accepted
        )

    })

});

app.get('/retos-min/:id', (req, resp) => {

    let response = JSON.parse(JSON.stringify(responseReto));
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
        response.Accepted.reto = retosDB

        return resp.json(
            response.Accepted
        )



    })

});


app.post('/crear-reto', [verificaToken], (req, resp) => {

    let body = _.pick(req.body, ['titulo', 'nivel', 'ranking', 'votos', 'participantes', 'descripcion', 'adicional', 'estado', 'icon']);

    let requestReto = body;
    let response = JSON.parse(JSON.stringify(responseReto));

    let reto = new Retos(requestReto);

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

        response.Accepted.reto = retoDB;
        response.Accepted.registros = 1;

        return resp.json(response.Accepted)

    })

});


module.exports = app;