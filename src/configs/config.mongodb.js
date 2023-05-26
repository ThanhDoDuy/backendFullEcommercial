'use strict'

const dev = {
    app: {
        port: process.env.DEV_APP_PORT || 8080
    },
    db: {
        host: process.env.DEV_DB_HOST,
        port: process.env.DEV_DB_PORT,
        name: process.env.DEV_DB_NAME
    }
}

const production = {
    app: {
        port: process.env.PRO_APP_PORT || 8080
    },
    db: {
        host: process.env.PRO_DB_HOST || "mongodb+srv",
        port: process.env.PRO_DB_PORT,
        name: process.env.PRO_DB_NAME || "nikkishop:Duythanh1997.@cluster0.gmgqo.mongodb.net"
    }
}
const config = {dev, production};
const env = process.env.NODE_ENC || 'dev';

module.exports = config[env];