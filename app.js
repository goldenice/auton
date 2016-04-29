'use strict';

const express           = require('express');
const bodyparser        = require('body-parser');
const servestatic       = require('serve-static');
const attachApi         = require('./server/api.js');

const app = express();

app.get('/', servestatic('client'));

attachApi(app.listen(8080, () => {
    console.log("Server listening on port 8080");
}));
