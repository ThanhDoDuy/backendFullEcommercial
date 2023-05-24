const express = require("express");
const app = express();

const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");

// init middleware
app.use(morgan("dev")); // show every req detail
app.use(helmet()); // protect server framework
app.use(compression()) // protect band thong when sending to client can decrease the size from 141kb To 1,4KB
// init db

// init routers
app.get('/', (req, res, next) => {
    return res.status(200).json({
        message: "WELCOME"
    })
})
// handling errors

module.exports = app;