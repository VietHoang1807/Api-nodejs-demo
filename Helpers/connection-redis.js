const redis = require('redis');
const client = redis.createClient()
client.connect();

client.on('error', function (err) {
    console.log('Redis Client Error', err)
});

client.on('ready', function (err) {
    console.log('Redis Client ready',err)
});

client.on('connect', function (err) {
    console.log('Redis Client connect')
});

module.exports = {client};