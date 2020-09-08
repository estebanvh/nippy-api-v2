const Dia = require('../models/dia.model');

let registrarDia = (dia, idReto) => {


    let body = {
        idReto: idReto,
        idDia: dia._id,
        dia: dia.dia,
        inicio: dia.inicio,
        fin: dia.fin,
        estado: dia.estado,
        fechaRealTermino: dia.fechaRealTermino
    }

    let registro = new Dia(body);
    registro.save((err, diaDB) => {

        if (err) {
            console.log(err);
            return;
        }

    });

}

let eliminarDia = (id) => {

    Dia.deleteOne({ idDia: id }, (err, deleteDB) => {

        if (err) {
            console.log(err);
            return;
        }

    })

}

module.exports = {
    registrarDia,
    eliminarDia
}