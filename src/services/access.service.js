'use strict'
const shopModel = require('../models/shop.model');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require('../auth/authUitls');
const {getInfoData} = require("../utils/index");

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: "WRITER",
    EDITOR: "EDITOR",
    ADMIN: "ADMIN"
}

class AccessService {

    static signUp = async ({name, email, password, verify}) => {
        try {
            // step1: check email exist???
            const holderShop = await shopModel.findOne({email}).lean();
            
            if (holderShop){
                return {
                    code: 'xxx',
                    message: "Shop is already registered!!!",
                }
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
                    return {
                        code: 'xxx',
                        message: "publicKeyString error!!!",
                    }
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
        } catch (error) {
            return {
                code: 'xxx',
                message: error.message,
                status: "error"
            }
        }
    }
};

module.exports = AccessService