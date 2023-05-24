'use strict'

const mongoose = require("mongoose");

const connectString = "mongodb+srv://nikkishop:Duythanh1997.@cluster0.gmgqo.mongodb.net/?retryWrites=true&w=majority";
const {countConnect} = require("../helpers/check.connect")
class Database {

    constructor(){
        this.connect()
    }
    // connect method
    connect(type = 'mongodb') {
        if(1===1){
            mongoose.set('debug', true);
            mongoose.set('debug', {color: true})
        }

        mongoose
        .connect(connectString, {
            maxPoolSize: 100 
        })
        .then( _ => {
            console.log(`Connect successfully!!!`, countConnect())
        })
        .catch((err) => {
            console.log(`Error Connect: ${err}`);
        });
    }

    static getInstance() {
        if(!Database.instance){
            Database.instance = new Database()
        }
        return Database.instance
    }

}

const instanceMongoDB = Database.getInstance();
module.exports = instanceMongoDB;