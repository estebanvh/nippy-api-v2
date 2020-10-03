//login Api
const respLogin = {
    Accepted: {
        ok: true,
        error: {
            mensaje: "Login exitoso"
        },
        token: ""
    },
    Rejected: {
        ok: false,
        error: {
            mensaje: ""
        }
    }

};
//fin login

//response universal
const responseApi = `{
    "Accepted": {
        "ok": true,
        "mensaje": "Transacción exitosa",
        "object": "",
        "registros": 0
    },
    "Rejected": {
        "ok": false,
        "error": {
            "mensaje": "Error al realizar la petición",
            "detalle": ""
        }
    }

}`;

//response universal
const responseApiV2 =
    `{
        "ok"        : true,
        "mensaje"   : "Transacción exitosa",
        "detalle"   : "",
        "object"    : "",
        "registros" : 0,
        "paginacion" : {
            "anterior": "",
            "actual" : "",
            "posterior":"",
            "totalRegistros": ""
        }
    }`;



const responseInscribirReto = {
    Accepted: {
        ok: true,
        mensaje: "Transacción exitosa",
        inscripcion: "",
        registros: 0
    },
    Rejected: {
        ok: false,
        error: {
            mensaje: "Error al realizar la petición",
            detalle: ""
        }
    }

}

const responseEstadisticaReto = {
    Accepted: {
        ok: true,
        mensaje: "Transacción exitosa",
        estadistica: "",
        registros: 0
    },
    Rejected: {
        ok: false,
        error: {
            mensaje: "Error al realizar la petición",
            detalle: ""
        }
    }

}

const responseInscripciones = {
    Accepted: {
        ok: true,
        mensaje: "Transacción exitosa",
        inscripciones: "",
        registros: 0
    },
    Rejected: {
        ok: false,
        error: {
            mensaje: "Error al realizar la petición",
            detalle: ""
        }
    }

}






module.exports = {
    responseApiV2,
    responseApi,
    respLogin,
    responseInscribirReto,
    responseEstadisticaReto,
    responseInscripciones
}