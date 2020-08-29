const mongoose = require('mongoose');
const User = require('./usuario.model');
const Reto = require('./retos.model');

let Schema = mongoose.Schema;
let date = new Date();


let estadosValidos = {
    values: ['ACEPTADO', 'PROCESO', 'OK', 'NOOK'],
    message: '{VALUE} no es un estado válido'
}

let retoUserSchema = new Schema({

    fechaAceptado: {
        type: Number,
        required: true,
        default: date.getTime()
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
    ultActualizacion: {
        type: Number,
        default: date.getTime()
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
        }],
        default: [{
            dia: 1,
            inicio: date.getTime(),
            fin: (date.getTime() + (1 * 24 * 60 * 60 * 1000)),
            estado: "PROCESO"
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