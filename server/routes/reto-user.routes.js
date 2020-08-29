const express = require('express');
const app = express();
const _ = require('underscore');

const RetosUsers = require('../models/reto-user.model');
const Retos = require('../models/retos.model');


let { responseInscribirReto, responseEstadisticaReto, responseInscripciones, responseReto } = require('../constantes/const')

app.post('/inscribir-reto', (req, resp) => {

    let response = JSON.parse(JSON.stringify(responseInscribirReto));
    let body = _.pick(req.body, ["user", "reto", "estado", "totalDias"]);
    //  let avance = Math.round(100 / body.totalDias) === 0 ? 1 : Math.round(100 / body.totalDias);
    let avance = 0;
    body.avance = avance;

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
        return resp.json(response.Accepted);


    })
});

app.get('/get-inscripcion/:id', (req, resp) => {

    let response = JSON.parse(JSON.stringify(responseInscripciones));
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

            response.Accepted.inscripciones = inscripcionDB;
            response.Accepted.registros = inscripcionDB.length;
            return resp.json(response.Accepted);

        })

})


app.get('/avance-reto/:id', (req, resp) => {

    let id = req.params.id;
    response = JSON.parse(JSON.stringify(responseEstadisticaReto));

    RetosUsers.findById(id, (err, inscripcionDB) => {


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
            cantSemanas: Math.round(inscripcionDB.totalDias / 7)
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
    let response = JSON.parse(JSON.stringify(responseReto));

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
                response.Accepted.reto = retosDB;
                return resp.json(response.Accepted);

            }

            response.Accepted.registros = retosDB.length;
            response.Accepted.reto = retosDB;
            return resp.json(response.Accepted);

        })

    });
});

app.put('/actualizar-avance', (req, resp) => {

    let date = new Date();
    let response = JSON.parse(JSON.stringify(responseInscribirReto));
    let id = req.body.id;

    if (!id) {
        response.Rejected.error.mensaje = "No se encontro el recurso solicitado";
        return resp.status(404).json(response.Rejected);
    }

    RetosUsers.findById(id, (err, inscripcionDB) => {

        let dias = inscripcionDB.dias;
        let diaActual = dias[dias.length - 1]

        if (inscripcionDB.diaActual === inscripcionDB.totalDias) {

            inscripcionDB.estado = "OK";
            inscripcionDB.fechaFinalizado = date.getTime();
            inscripcionDB.avance = "100";

            diaActual.estado = "OK";
            diaActual.fechaRealTermino = date.getTime();

            inscripcionDB.dias.pop();
            inscripcionDB.dias.push(diaActual);

        } else {

            let nuevoDia = {
                dia: diaActual.dia + 1,
                inicio: diaActual.fin,
                fin: (diaActual.fin + (1 * 24 * 60 * 60 * 1000)),
                estado: 'PROCESO'
            }

            diaActual.estado = 'OK';
            diaActual.fechaRealTermino = date.getTime();

            dias.pop();
            dias.push(diaActual);
            dias.push(nuevoDia);
            inscripcionDB.dias = dias;
            inscripcionDB.avance = Math.round(100 / inscripcionDB.totalDias) === 0 ? 1 : Math.round(diaActual.dia * 100 / inscripcionDB.totalDias);
            inscripcionDB.diaActual += 1;

        }

        inscripcionDB.ultActualizacion = date.getTime();
        inscripcionDB.save((errGuardar, inscripcionNuevo) => {

            if (errGuardar) {
                response.Rejected.error.detalle = err;
                return resp.status(500).json(response.Rejected);
            }

            response.Accepted.registros = inscripcionNuevo.length;
            response.Accepted.inscripcion = inscripcionNuevo;
            return resp.json(response.Accepted);

        })

    })


})


module.exports = app;