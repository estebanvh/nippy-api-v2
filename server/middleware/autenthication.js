const jwt = require('jsonwebtoken');

let verificaToken = (req, resp, next) => {

    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {

            return resp.status(401).json({
                ok: false,
                error: {
                    mensaje: "Es necesario poseer token para realizar la peticion",
                    detalle: err
                }
            });
        }

        req.usuario = decoded.data;
        next();

    })

};

module.exports = {

    verificaToken

}