'use strict'

const {Schema, model}  = require('mongoose'); // Erase if already required
const DOCUMENT_NAME = 'Keys';
const COLLECTION_NAME = 'Keys';
// Declare the Schema of the Mongo model
var keySchema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        required:true,
        ref: 'Shops',
    },
    publicKey:{
        type:String,
        required:true,
    },
    privateKey:{
        type:String,
        required:true,
    },
    // dectect the expired used publickey which Hacker use this token => punish
    refreshToken:{
        type:Array,
        default:[],
    }
},{
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, keySchema);