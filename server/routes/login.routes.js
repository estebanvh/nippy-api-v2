const express = require('express');
const app = express();

//response
const { respLogin } = require('../constantes/const');

//funciones
const { generarToken } = require('../funciones/token');


app.post("/login", (req, resp) => {

    const username = req.body.username || "";
    const password = req.body.password || "";

    let responde = JSON.parse(JSON.stringify(respLogin));

    if (username === "" || password === "") {

        responde.Rejected.error.mensaje = "Debe indicar el username/password";
        return resp.status(400).json(
            responde.Rejected
        );
    }

    let credenciales = {
        username: "admin",
        password: "nippyAdmin"
    };

    if (username != credenciales.username || password != credenciales.password) {

        responde.Rejected.error.mensaje = "Username/Password invalido";
        return resp.status(400).json(
            responde.Rejected
        );

    }

    //generar token
    responde.Accepted.token = generarToken(credenciales);

    return resp.json(
        responde.Accepted
    );


});


module.exports = app;