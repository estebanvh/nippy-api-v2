//token
const jwt = require('jsonwebtoken');

let generarToken = (data) => {

    let token = jwt.sign({
        data
    }, process.env.SEED, {
        expiresIn: process.env.EXPIRE
    });

    return token;

}



module.exports = {
    generarToken
}