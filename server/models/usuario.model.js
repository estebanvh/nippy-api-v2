const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({

    nombre: {
        type: String,
        required: [true, 'Nombre requerido'],
        unique: true
    },

    email: {
        type: String,
        required: [true, "Email es requerido"],
        unique: true
    },

    password: {
        type: String,
        required: [true, "Password es requerido"]
    },

    puntos: {
        type: Number,
        default: 0
    },

    retoActivo: {
        type: String,
        required: false,
        default: ""
    },
    inscripcionActiva: {
        type: String,
        required: false,
        default: ""
    },

    estado: {
        type: Boolean,
        default: true,
        required: [true, 'Debe registrarse un estado']
    }

});


usuarioSchema.methods.toJSON = function() {

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único' })

module.exports = mongoose.model('Usuario', usuarioSchema);