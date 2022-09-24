const crypto = require('crypto');

const key = crypto.randomBytes(32).toString('hex');
const key1 = crypto.randomBytes(32).toString('hex');

console.table({key,key1})