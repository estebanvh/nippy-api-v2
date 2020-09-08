const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let diaSchema = new Schema({

    idReto: {
        type: mongoose.Types.ObjectId,
        required: true
    },

    idDia: {
        type: mongoose.Types.ObjectId
    },

    dia: {
        type: Number
    },
    inicio: {
        type: Number
    },
    fin: {
        type: Number
    },
    estado: {
        type: String
    },
    fechaRealTermino: {
        type: Number
    }

});

module.exports = mongoose.model('Dia', diaSchema);