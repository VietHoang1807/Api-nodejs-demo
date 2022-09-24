const mongoose = require('mongoose');

const conn = mongoose.createConnection('mongodb://localhost:27017/test', {
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

process.on('SIGINT', async() =>{ 
    await conn.close();
    process.exit(0);
})

module.exports = conn;