'use strict'
const mongoose = require("mongoose");
const os = require('os');
const process = require("process");
const _SECONDS = 5000;
// count connection
const countConnect = () => {
    const numberConnection = mongoose.Connection.length;
    console.log(`Number of connection:: ${numberConnection}`)
    return numberConnection
}

// check overload
const checkOverLoad = () => {
    setInterval( () => {
        const numberConnection = mongoose.Connection.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss;
        // Example maximum number of connections based on number of cores
        const maxConnection = numCores * 5;
        console.log(`Active connection: ${numberConnection}`);
        console.log(`Memory Usage: ${memoryUsage/1024/1024} MB`);

        if (numberConnection> maxConnection){
            console.log(`Connection overload detected!`);
        }
    }, _SECONDS) // Monitor every 5 seconds
}

module.exports = {
    countConnect,
    checkOverLoad
}