const express = require('express');
const app = express();
const retosDAO = require('../dao/retos.dao');

//const { verificaToken } = require('../middleware/autenthication');


app.get('/retos', retosDAO.obtenerRetos);


app.get("/retos/reto/:id", retosDAO.obtenerRetoPorId);


//app.post('/crear-reto', [verificaToken], (req, resp) => {
app.post('/retos/reto', retosDAO.crearReto);


app.put('/retos/reto/:id', retosDAO.updateReto);


module.exports = app;