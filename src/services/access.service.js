'use strict'
const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require('../auth/authUitls');
const {getInfoData} = require("../utils/index");
const { BadRequestError, AuthFailureError } = require('../core/error.response');

// services
const {findByEmai} = require('./shop.service')

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: "WRITER",
    EDITOR: "EDITOR",
    ADMIN: "ADMIN"
}

class AccessService {

    /*
        1- Check email in dbs
        2- match password
        3- create AT vs RT and save
        4- generate tokens
        5- get data and return login
    */

    static login = async( {email, password, refreshToken = null}) =>{
        const foundShop = await findByEmai({email});
        if (!foundShop){
            throw new BadRequestError('Shop is not registered!')
        }

        const match = bcrypt.compare(password, foundShop.password);
        if (!match) throw new AuthFailureError("Authentication error")

        const publicKey = crypto.randomBytes(64).toString('hex');
        const privateKey = crypto.randomBytes(64).toString('hex');
        // cretae token pair
        const tokens = await createTokenPair({userID: newShop._id, email}, publicKey, privateKey);

        await KeyTokenService.createKeyToken({
            refreshToken: tokens.refreshToken,
            privateKey,
            publicKey
        })

        return {
                shop: getInfoData({fields: ["_id", "name", "email"], object: foundShop}),
                tokens
            }

    }

    static signUp = async ({name, email, password, verify}) => {
        // try {
            // step1: check email exist???
            const holderShop = await shopModel.findOne({email}).lean();
            
            if (holderShop){
                throw new BadRequestError('Error: Shop already registered!!')
            }
            const passwordHash = await bcrypt.hash(password, 10);

            const newShop = await shopModel.create({
                name, email, password: passwordHash, verify, roles : [RoleShop.SHOP]
            })

            // access token and refresh Token 
            if (newShop){
                // create privateKey and publicKey with complex RSA
                // const {privateKey, publicKey} = crypto.generateKeyPairSync('rsa', {
                //     modulusLength: 4096,
                //     publicKeyEncoding: {
                //         type: 'spki',       // Encoding type for the public key
                //         format: 'pem'       // Output format for the public key
                //       },
                //       privateKeyEncoding: {
                //         type: 'pkcs8',      // Encoding type for the private key
                //         format: 'pem'       // Output format for the private key
                //       }
                // });

                // use easy-algorithm 
                const publicKey = crypto.randomBytes(64).toString('hex');
                const privateKey = crypto.randomBytes(64).toString('hex');

                const keyStore= await KeyTokenService.createKeyToken({
                    userID: newShop._id,
                    publicKey,
                    privateKey
                });

                if (!keyStore){
                    throw new BadRequestError('Error: publicKeyString error!!!');
                }

                // cretae token pair
                const tokens = await createTokenPair({userID: newShop._id, email}, publicKey, privateKey)
                console.log(`Created token Success::`, tokens);

                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({fields: ["_id", "name", "email"], object: newShop}),
                        tokens
                    }
                }
            }

            return {
                code: 201,
                metadata: null
            }
    }
};

module.exports = AccessService