const express = require('express');
const app = express();

const _ = require('underscore');
const Tip = require('../models/tips.model');
const { responseApi } = require('../constantes/const');

let validateResponse = (resp, err, objectDB) => {

    let response = JSON.parse(responseApi);
    if (err) {
        response.Rejected.detalle = err;
        return resp.status(500).json(response.Rejected);
    }

    if (!objectDB) {

        response.Accepted.mensaje = "No existe(n) registro(s)"
        response.Accepted.object = [];
        return resp.json(response.Rejected);
    }

    response.Accepted.registros = 1;
    response.Accepted.object = objectDB;
    return resp.json(response.Accepted);

}

app.get('/get-tips', (req, resp) => {

    Tip.find((err, tipsDB) => {

        return validateResponse(resp, err, tipsDB);

    })

});

app.post("/new-tips", (req, resp) => {

    let body = _.pick(req.body, ['titulo', 'descripcion']);
    let tip = new Tip(body);

    tip.save((err, tipDB) => {

        return validateResponse(resp, err, tipDB);

    })

});

module.exports = app;