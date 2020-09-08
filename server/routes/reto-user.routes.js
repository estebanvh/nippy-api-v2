const express = require('express');
const app = express();
const _ = require('underscore');

const RetosUsers = require('../models/reto-user.model');
const Retos = require('../models/retos.model');

const { registrarDia, eliminarDia } = require('../funciones/dias');



let { responseInscribirReto, responseEstadisticaReto, responseInscripciones, responseApi } = require('../constantes/const')

app.post('/inscribir-reto', (req, resp) => {

    let response = JSON.parse(JSON.stringify(responseInscribirReto));
    let avance = 0;
    let body = _.pick(req.body, ["user", "reto", "estado", "totalDias"]);

    body.ultActualizacion = new Date().getTime();
    body.avance = avance;

    let dia = [];
    dia.push({
        dia: 1,
        inicio: new Date().getTime(),
        fin: new Date().getTime() + Number(process.env.CADUCA_DIA),
        estado: "PROCESO"
    })

    body.dias = dia;

    let retoUser = new RetosUsers(body);

    retoUser.save((err, retoUserDB) => {

        if (err) {
            response.Rejected.error.detalle = err;
            return resp.status(500).json(response.Rejected);
        }

        if (!retoUserDB) {
            response.Rejected.error.mensaje = "No se realizó la inscripción. Intente nuevamente";
            return resp.status(400).json(response.Rejected);
        }

        response.Accepted.registros = retoUserDB.length;
        response.Accepted.inscripcion = retoUserDB._id;
        registrarDia(retoUserDB.dias[0], retoUser._id);
        return resp.json(response.Accepted);


    })
});

app.get('/get-inscripcion/:id', (req, resp) => {

    let response = JSON.parse(responseApi);
    let id = req.params.id;

    RetosUsers.findById(id)
        .populate("reto")
        .exec((err, inscripcionDB) => {

            if (err) {
                response.Rejected.error.detalle = error;
                return resp.status(500).json(response.Rejected);
            }

            if (!inscripcionDB) {
                response.Accepted.mensaje = "No se encontraron datos";
                response.Accepted.registros = 0;
                return resp.json(response.Accepted);
            }

            response.Accepted.object = inscripcionDB;
            response.Accepted.registros = inscripcionDB.length;
            return resp.json(response.Accepted);

        })

})


app.get('/avance-reto/:id', (req, resp) => {

    let id = req.params.id;
    response = JSON.parse(JSON.stringify(responseEstadisticaReto));

    RetosUsers.findById(id)
        .populate({
            path: 'reto',
            model: 'Reto',
            populate: {
                path: 'tips',
                model: 'Tip'
            }
        })
        .exec((err, inscripcionDB) => {

            if (err) {
                response.Rejected.error.detalle = err;
                return resp.status(500).json(response.Rejected);
            }

            if (!inscripcionDB) {
                response.Rejected.error.mensaje = "No se encontraron registros para la inscripción solicitada";
                return resp.status(400).json(response.Rejected);

            }

            let dias = inscripcionDB.dias;
            dias = dias[dias.length - 1];

            let cantTips = inscripcionDB.reto.tips.length;
            let tip;

            if (cantTips > 0) {

                if (cantTips >= dias.dia) {
                    tip = inscripcionDB.reto.tips[dias.dia - 1];
                } else {
                    tip = inscripcionDB.reto.tips[(dias.dia - cantTips) - 1]
                }

            }

            body = {
                _id: inscripcionDB._id,
                reto: inscripcionDB.reto,
                diaInicial: dias.dia === 1 ? true : false,
                diaFinal: dias.dia === inscripcionDB.totalDias ? true : false,
                totalDias: inscripcionDB.totalDias,
                diaActual: dias.dia,
                idDia: dias._id,
                estadoReto: inscripcionDB.estado,
                fechaInicio: dias.inicio,
                avance: inscripcionDB.avance + '%',
                cantSemanas: Math.round(inscripcionDB.totalDias / 7),
                tip
            };

            response.Accepted.registros = 1;
            response.Accepted.estadistica = body;
            return resp.json(response.Accepted);

        })

});


app.get('/inscripciones-usuario/:id', (req, resp) => {

    let query = {
        user: '',
        estado: ''
    }

    query.user = req.params.id;
    if (req.query.estado === undefined || req.query.estado === '') {
        delete query.estado;
    } else {
        query.estado = req.query.estado;
    }

    response = JSON.parse(JSON.stringify(responseInscripciones));

    RetosUsers.find(query)
        .sort({ ultActualizacion: -1 })
        .populate('reto')
        .exec((err, inscripcionesDB) => {

            if (err) {
                response.Rejected.error.detalle = err;
                return resp.status(500).json(response.Rejected);
            }

            if (!inscripcionesDB) {
                response.Accepted.mensaje = "No se ha inscrito a ningún reto";
                response.Accepted.inscripciones = [];
                response.Accepted.registros = 0;
                return resp.json(response.Accepted);
            }

            response.Accepted.inscripciones = inscripcionesDB;
            response.Accepted.registros = inscripcionesDB.length;
            return resp.json(response.Accepted);

        });

})



app.get('/retos-recomendados-usuario/:id', (req, resp) => {

    let id = req.params.id;
    let response = JSON.parse(responseApi);

    RetosUsers.find({ user: id, estado: 'PROCESO' }, (err, inscripcionesDB) => {

        if (err) {

            response.Rejected.error.mensaje = err;
            resp.status(500).json(response.Rejected);

        }

        let retosArray = [];

        if (inscripcionesDB) {
            inscripcionesDB.forEach(inscripcion => retosArray.push(inscripcion.reto));
        }

        Retos.find({ _id: { $nin: retosArray } }, (errRetos, retosDB) => {


            if (errRetos) {

                response.Rejected.error.mensaje = errRetos;
                return resp.status(500).json(response.Rejected);
            }

            if (!retosDB) {

                response.Accepted.mensaje = "No tienes retos disponibles";
                response.Accepted.registros = 0;
                response.Accepted.object = retosDB;
                return resp.json(response.Accepted);

            }

            response.Accepted.registros = retosDB.length;
            response.Accepted.object = retosDB;
            return resp.json(response.Accepted);

        })

    });
});

app.put('/actualizar-avance', (req, resp) => {

    let response = JSON.parse(JSON.stringify(responseInscribirReto));
    let id = req.body.id;
    let final = false;

    if (!id) {
        response.Rejected.error.mensaje = "No se encontro el recurso solicitado";
        return resp.status(404).json(response.Rejected);
    }

    RetosUsers.findById(id, (err, inscripcionDB) => {

        let dias = inscripcionDB.dias;
        let diaActual = dias[dias.length - 1]
        eliminarDia(diaActual._id);

        if (inscripcionDB.diaActual === inscripcionDB.totalDias) {

            inscripcionDB.diasCompletados += 1;
            inscripcionDB.estado = "OK";
            inscripcionDB.fechaFinalizado = new Date().getTime();
            inscripcionDB.avance = Math.round(inscripcionDB.diasCompletados * 100 / inscripcionDB.totalDias);


            diaActual.estado = "OK";
            diaActual.fechaRealTermino = new Date().getTime();

            inscripcionDB.dias.pop();
            inscripcionDB.dias.push(diaActual);
            final = true;

        } else {
            let nuevoDia = {
                dia: diaActual.dia + 1,
                inicio: diaActual.fin,
                fin: (Number(diaActual.fin) + Number(process.env.CADUCA_DIA)),
                estado: 'PROCESO'
            }

            inscripcionDB.diasCompletados += 1;
            diaActual.estado = 'OK';
            diaActual.fechaRealTermino = new Date().getTime();

            dias.pop();
            dias.push(diaActual);
            dias.push(nuevoDia);
            inscripcionDB.dias = dias;
            inscripcionDB.avance = Math.round(100 / inscripcionDB.totalDias) === 0 ? 0 : Math.round(inscripcionDB.diasCompletados * 100 / inscripcionDB.totalDias);
            inscripcionDB.diaActual += 1;

        }

        inscripcionDB.ultActualizacion = new Date().getTime();
        inscripcionDB.save((errGuardar, inscripcionNuevo) => {

            if (errGuardar) {
                response.Rejected.error.detalle = err;
                return resp.status(500).json(response.Rejected);
            }

            response.Accepted.registros = inscripcionNuevo.length;
            response.Accepted.inscripcion = _.pick(inscripcionNuevo, ['_id', 'estado', 'diaActual']);

            // registra dato en colleccion dia, para validar caducidad
            if (!final) {
                registrarDia(inscripcionNuevo.dias[dias.length - 1], inscripcionNuevo._id);
            } else {
                eliminarDia(inscripcionNuevo._id);
            }

            return resp.json(response.Accepted);

        })

    })


})


module.exports = app;