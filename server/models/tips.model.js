const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let tipSchema = new Schema({

    titulo: {
        type: String,
        required: [true, 'Titulo Obligatorio'],
        unique: true
    },

    descripcion: {
        type: String,
        required: [true, 'Descripción obligatoria']
    }

});

tipSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' })
module.exports = mongoose.model('Tip', tipSchema);