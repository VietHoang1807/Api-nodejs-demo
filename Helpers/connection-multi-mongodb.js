const mongoose = require('mongoose');
require('dotenv').config();

function newConnect(uri) {
    const conn = mongoose.createConnection(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    
    conn.on('connected', function() {
        console.log(`mongodb:: connect:: ${this.name}`)
    })
    
    conn.on('disconnected', function() {
        console.log(`mongodb:: disconnected:: ${this.name}`)
    })
    
    conn.on('errors', function(error) {
        console.log(`mongodb:: errors:: ${JSON.stringify(error)}`)
    })
    return conn;
}

const testConnect = newConnect(process.env.URI_MONGODB_TEST);
const userConnect = newConnect(process.env.URI_MONGODB_USERS);

module.exports = {testConnect, userConnect}