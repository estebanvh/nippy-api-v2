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

//Usuario
const requestUser = {
    nombre: "",
    email: "",
    password: "",
    puntos: "",
    isEncrypt: ""
};

const responseUser = {
    Accepted: {
        ok: true,
        mensaje: "Transacción exitosa",
        user: "",
        registros: 0
    },

    Rejected: {
        ok: false,
        error: {
            mensaje: "Error al realizar la petición",
            detalle: ""
        }
    }
};

//Retos Api
const requestReto = {
    titulo: "",
    nivel: "",
    ranking: "",
    votos: "",
    participantes: "",
    descripcion: "",
    adicional: "",
    estado: "",
    icon: ""
};

const responseReto = {
    Accepted: {
        ok: true,
        mensaje: "Transacción exitosa",
        reto: "",
        registros: 0
    },

    Rejected: {
        ok: false,
        error: {
            mensaje: "Error al realizar la petición",
            detalle: ""
        }
    }
};


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
    respLogin,
    requestReto,
    responseReto,
    requestUser,
    responseUser,
    responseInscribirReto,
    responseEstadisticaReto,
    responseInscripciones
}