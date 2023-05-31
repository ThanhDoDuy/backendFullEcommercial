'use strict'
const _ = require('lodash');

const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}
const {findById} = require('../services/apiKey.service');

const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString()
        if (!key){
            return res.status(403).json({
                message: `Forbidden Error`
            })
        }

        // check objectKey
        const objKey = await findById(key)
        if (!objKey){
            return res.status(403).json({
                message: `Forbidden Error`
            })
        }
        
        req.objKey = objKey;
        return next();
    } catch (error) {
        return res.status(403).json({
            message: `Error: ${error}`
        })
    }
}

const permission = (permission) => {
    return (req, res, next) => {
        if (!req.objKey.permissions){
            return res.status(403).json({
                message: `Permission denied!!!`
            })
        }

        const validPermission = _.includes(req.objKey.permissions, permission);
        if (!validPermission){
            return res.status(403).json({
                message: `Permission denied!!!`
            })
        }

        return next()
    }
}

module.exports = {
    apiKey,
    permission
}