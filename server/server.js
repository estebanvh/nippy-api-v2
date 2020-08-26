//config
require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();



// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(cors());

//importar rutas
app.use(require('./routes/index.routes'));

console.log(process.env.DB_URI);
app.listen(process.env.PORT, () => {

    mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }, (err, res) => {
        if (err) throw err;
        console.log('Base de datos up');

    });

    console.log("nippy api run");

})