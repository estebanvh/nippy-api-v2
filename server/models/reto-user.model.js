const mongoose = require('mongoose');
const User = require('./usuario.model');
const Reto = require('./retos.model');


let Schema = mongoose.Schema;


let estadosValidos = {
    values: ['ACEPTADO', 'PROCESO', 'OK', 'NOOK'],
    message: '{VALUE} no es un estado válido'
}

let retoUserSchema = new Schema({

    fechaAceptado: {
        type: Number,
        required: true,
        default: new Date().getTime()
    },
    fechaFinalizado: {
        type: Number,
    },
    totalDias: {
        type: Number,
        default: 1
    },
    diaActual: {
        type: Number,
        default: 1
    },
    estado: {
        type: String,
        default: 'PROCESO',
        enum: estadosValidos
    },
    avance: {
        type: Number
    },
    diasCompletados: {
        type: Number,
        default: 0
    },
    ultActualizacion: {
        type: Number,
        default: new Date().getTime()
    },
    dias: {
        type: [{
            dia: Number,
            inicio: Number,
            fin: Number,
            fechaRealTermino: Number,
            estado: {
                type: String,
                enum: estadosValidos
            }
        }]
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: User
    },
    reto: {
        type: mongoose.Types.ObjectId,
        ref: Reto
    }

});

module.exports = mongoose.model('RetosUsers', retoUserSchema)