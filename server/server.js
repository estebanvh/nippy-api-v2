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

app.listen(process.env.PORT, () => {

    mongoose.connect(process.env.DB_URI, {
        user: process.env.MONGO_USER,
        pass: encodeURIComponent(process.env.MONGO_PASS),
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }, (err) => {
        if (err) throw err;
        console.log('Base de datos up');

    })


    console.log("nippy api run");

})