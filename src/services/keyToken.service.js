'use strict'

const keytokenModel = require("../models/keytoken.model");

class KeyTokenService {
    static createKeyToken = async ({userID, publicKey, privateKey, refreshToken}) => {
        try {
            // easy
            // const tokens = await keytokenModel.create({
            //     user: userID,
            //     publicKey,
            //     privateKey
            // });

            // return tokens ? tokens : null
            const filter = { user: userID}, update = {
                publicKey, privateKey, refreshTokensUsed: [], refreshToken
            }, options = {upsert: true, new: true}
            const tokens  = await keytokenModel.findOneAndUpdate(filter, update, options);

            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    }
}

module.exports = KeyTokenService