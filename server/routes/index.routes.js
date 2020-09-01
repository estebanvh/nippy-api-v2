const express = require('express');
const app = express();

app.use(require('./login.routes'));
app.use(require('./reto.routes'));
app.use(require('./user.routes'));
app.use(require('./reto-user.routes'));
app.use(require('./tips.routes'));

module.exports = app;