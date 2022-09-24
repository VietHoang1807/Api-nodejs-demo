const mongoose = require('mongoose');
const schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const {testConnect} = require('../Helpers/connection-multi-mongodb');

const UserSchema = new schema({
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    department: {
        type: String
    },
    localtion: {
        type: String
    },
    address: {
        type: String
    }
});

UserSchema.pre('save', async function(next) {
    try{
        const salt = await bcrypt.genSalt(10);
        const hashpasss = await bcrypt.hash(this.password, salt);
        this.password = hashpasss;
    }catch(error) {
        next(error);
    }
})

UserSchema.methods.isCheckPassword = async function(password) {
    try {
        return await bcrypt.compare(password, this.password)
    } catch (error) {}
}

module.exports = testConnect.model('user', UserSchema);