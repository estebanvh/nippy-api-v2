const mongoose = require('mongoose');
const Tip = require('./tips.model');

let Schema = mongoose.Schema;

let retoSchema = new Schema({

    titulo: {
        type: String,
        required: [true, "Titulo requerido"],
        unique: true
    },

    nivel: {
        type: Number,
        required: [true, "Nivel de dificultad es requerido"]
    },

    ranking: {
        type: Number,
        default: 0
    },

    votos: {
        type: Number,
        default: 0
    },

    participantes: {
        type: Number,
        default: 0
    },

    tiempo: {
        type: Number,
        default: 7
    },

    descripcion: {
        type: String,
        required: [true, "Descripción requerida"]
    },

    adicional: {
        type: Object,
        required: false
    },

    estado: {
        type: Boolean,
        default: true
    },
    miniIcon: {
        type: String,
        default: ""
    },
    icon: {
        type: String,
        default: ""
    },
    tips: [{ type: mongoose.Types.ObjectId, ref: Tip }]

})

module.exports = mongoose.model('Reto', retoSchema);