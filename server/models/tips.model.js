const mongoose = require('mongoose');


let Schema = mongoose.Schema;

let tipSchema = new Schema({

    titulo: {
        type: String,
        required: [true, 'Titulo Obligatorio']
    },

    descripcion: {
        type: String,
        required: [true, 'Descripción obligatoria']
    }

});

module.exports = mongoose.model('Tip', tipSchema);