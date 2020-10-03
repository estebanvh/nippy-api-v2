const _ = require('underscore');
const { responseApiV2 } = require('../constantes/const');
const Retos = require('../models/retos.model');

const obtenerRetos = (req, resp) => {

    let response = JSON.parse(responseApiV2);
    let request = _.pick(req.query, ['estado', 'fase', 'titulo', 'descripcion', 'nivel']);

    let { pagina, limite } = _.pick(req.query, ['pagina', 'limite']);
    let skip = null;

    if (pagina && limite) {
        skip = ((Number(pagina) - 1) * limite);
        limite = Number(limite);
    } else {
        limite = 0;
    }

    Retos.find(request).skip(skip).limit(limite).populate("tips").exec((err, retosDB) => {

        if (err) {

            response.ok = false;
            response.mensaje = "Transacción NO OK";
            response.detalle = err;
            return resp.status(500).json(response);

        }

        if (retosDB.length === 0) {

            response.ok = false;
            response.mensaje = "No se encontraron registros";
            response.object = [];
            delete response.detalle;
            return resp.status(404).json(response);

        }

        Retos.countDocuments(request, (err, count) => {

            response.registros = retosDB.length;
            response.object = retosDB;
            response.paginacion.anterior = pagina ? Number(pagina) - 1 : 0;
            response.paginacion.actual = Number(pagina);
            response.paginacion.posterior = pagina ? Number(pagina) + 1 : 0;
            response.paginacion.totalRegistros = count;

            delete response.detalle;
            return resp.json(response);

        })


    })

}

const obtenerRetoPorId = (req, resp) => {

    let id = req.params.id;

    let response = JSON.parse(responseApiV2);

    Retos.findById(id).populate('tips').exec((err, retoDB) => {

        if (err) {

            response.ok = false;
            response.mensaje = "Transacción NO OK";
            response.detalle = err;
            return resp.status(500).json(
                response
            );
        }

        if (retoDB.length === 0) {

            response.ok = false;
            response.mensaje = "No existen registros";
            delete response.detalle;
            return resp.status(404).json(
                response
            )
        };

        response.object = retoDB;
        response.registros = retoDB.length;
        delete response.detalle;
        return resp.json(
            // response.Accepted
            response
        )

    })

}

const crearReto = (req, resp) => {

    let body = _.pick(req.body, ['titulo', 'nivel', 'ranking', 'votos', 'participantes', 'descripcion', 'adicional', 'estado', 'icon', 'miniIcon', 'tips', 'tiempo']);

    let response = JSON.parse(responseApiV2);

    let reto = new Retos(body);

    reto.save((err, retoDB) => {

        if (err) {

            response.ok = false;
            response.mensaje = "Transaccion NO OK";
            response.detalle = err;
            return resp.status(500).json(
                response
            )
        }

        if (retoDB.length === 0) {
            response.ok = false;
            response.mensaje = "Error al crear el reto, intente nuevamente";
            delete response.detalle;
            return resp.status(404).json(
                response
            )
        }

        response.object = retoDB;
        response.registros = 1;
        delete response.detalle;

        return resp.json(response)

    })


}


const updateReto = (req, resp) => {

    let id = req.params.id;
    let body = req.body;

    let response = JSON.parse(responseApiV2);

    Retos.findByIdAndUpdate(id, body, (err, retoDB) => {

        if (err) {

            response.ok = false;
            response.mensaje = "Transacción NO OK";
            response.detalle = err;
            return resp.status(500).json(
                response
            );

        };


        if (retoDB.length === 0) {

            response.ok = false;
            response.mensaje = "No existen registros";
            delete response.detalle;
            return resp.status(404).json(
                response
            )
        };

        response.object = retoDB;
        response.registros = 1;
        delete response.detalle;

        return resp.json(response)


    });

}



module.exports = {

    obtenerRetos,
    obtenerRetoPorId,
    crearReto,
    updateReto
}