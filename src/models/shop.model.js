'use strict'

//!dmbg
const {model, Schema, Types} = require('mongoose');

const DOCUMENT_NAME = 'Shops';
const COLLECTION_NAME = 'Shops'
// Declare the Schema of the Mongo model
const shopSchema = new Schema({
    name:{
        type:String,
        trim:true,
        maxLength:150,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum:['active', 'inactive'],
        default:'inactive',
    },
    verify:{
        type:Schema.Types.Boolean,
        default: false,
        required:true,
    },
    roles:{
        type:Array,
        default:[],
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, shopSchema);