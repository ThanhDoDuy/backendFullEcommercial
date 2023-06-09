const express = require("express");
const app = express();

const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");

// init middlewareS
app.use(morgan("dev")); // show every req detail
app.use(helmet()); // protect server framework
app.use(compression()); // protect band thong when sending to client can decrease the size from 141kb To 1,4KB
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// init db
require('./dbs/init.mongodb');
// const {checkOverLoad} = require("./helpers/check.connect");
// checkOverLoad()
// init routers
app.use('/', require('./routes'))
// handling errors
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    const status = error.status || 500;
    return res.status(status).json({
        status: 'error',
        code: status,
        message: error.message || 'Internal server Error'
    })
})

module.exports = app;