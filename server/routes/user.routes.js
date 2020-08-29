const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');

const User = require('../models/usuario.model');
let { responseUser } = require('../constantes/const');



app.post('/nuevo-usuario', (req, resp) => {

    let requestUser = _.pick(req.body, ["nombre", "email", "password", "puntos", "isEncrypt", "estado"]);
    let response = JSON.parse(JSON.stringify(responseUser));
    let { isEncrypt } = requestUser;

    if (isEncrypt === 'false') {
        requestUser.password = bcrypt.hashSync(requestUser.password, 10)
    }

    delete requestUser.isEncrypt;

    let user = new User(requestUser);

    user.save((err, userDB) => {

        if (err) {
            response.Rejected.error.detalle = err;
            return resp.status(500).json(response.Rejected);
        }

        if (!userDB) {
            response.Rejected.error.detalle = "Error al crear el usuario, intente nuevamente";
            return resp.status(400).json(
                this.response.Rejected
            )
        }

        response.Accepted.user = userDB;
        response.Accepted.registros = 1;

        return resp.json(response.Accepted)

    })


});

app.get('/get-users', (req, resp) => {

    let condicion = req.query.estado ? { estado: req.query.estado } : {};
    let response = JSON.parse(JSON.stringify(responseUser));
    User.find(condicion).exec((err, userDB) => {

        if (err) {
            response.Rejected.error.detalle = err;
            return resp.status(500).json(response.Rejected);
        }

        if (!userDB) {
            response.Accepted.mensaje = "No se han encontrado registros";
            response.Accepted.registros = 0;
            response.Accepted.user = userDB;
            return resp.json(response.Accepted);
        }

        response.Accepted.user = userDB;
        response.Accepted.registros = userDB.length;
        return resp.json(response.Accepted);

    })


});




module.exports = app;