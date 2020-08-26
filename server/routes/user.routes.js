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

app.get('/get-ult-reto/:id', (req, resp) => {

    let id = req.params.id;

    User.findById(id, ['_id', 'retoActivo', 'inscripcionActiva', 'nombre'], (err, userDB) => {

        let response = JSON.parse(JSON.stringify(responseUser));
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

})


app.put('/actualizar-ult-reto-user', (req, resp) => {

    let response = JSON.parse(JSON.stringify(responseUser));
    let id = req.body.id;

    if (!id) {

        response.Rejected.error.mensaje = "Debe indicar el id del usuario";
        return resp.status(404).json(response.Rejected);
    }

    let params = _.pick(req.body, ['retoActivo', 'inscripcionActiva']);

    if (!params.retoActivo || !params.inscripcionActiva) {
        response.Rejected.error.mensaje = "Campos retoActivo e inscripcionActiva son obligatorios";
        return resp.status(404).json(response.Rejected);
    }

    User.findByIdAndUpdate(id, params, { new: true }, (err, userDB) => {

        if (err) {
            response.Rejected.error.mensaje = err;
            return resp.status(500).json(response.Rejected);
        }

        if (!userDB) {
            response.Rejected.error.mensaje = "No se encontro el ususario";
            return resp.status(404).json(response.Rejected);
        }

        response.Accepted.user = userDB;
        response.Accepted.registros = userDB.length;
        resp.json(response.Accepted);

    })


});

module.exports = app;