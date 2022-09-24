const JWT = require('jsonwebtoken');
const redis = require('redis');
const createError = require('http-errors')
const { client } = require('../Helpers/connection-redis')

const signAccessToken = async (userId) => {
    return new Promise((resolve, reject) => {
        const payload = { userId }
        const secret = process.env.ACCESS_KEY_TOKEN;
        const option = { expiresIn: '1h' }
        JWT.sign(payload, secret, option, (err, token) => {
            if (err) reject(err)
            resolve(token)
        })
    })
}

const signRefreshToken = async (userId) => {
    return new Promise((resolve, reject) => {
        const payload = { userId }
        const secret = process.env.REFERSH_KEY_TOKEN;
        const option = { expiresIn: '1y' }
        JWT.sign(payload, secret, option, async (err, token) => {
            console.log("🚀 ~ file: JWT-service.js ~ line 23 ~ JWT.sign ~ token", token)
            console.log("🚀 ~ file: JWT-service.js ~ line 23 ~ JWT.sign ~ err", err)
            if (err) reject(err);
            resolve(token)
            // const client = redis.createClient();
            // console.log("🚀 ~ file: JWT-service.js ~ line 36 ~ client.set ~ client", client)
            // client.set(userId.toString(), token, 'EX', 365 * 24 * 60 * 60, (err, reply) => {
            //     console.log("🚀 ~ file: JWT-service.js ~ line 27 ~ client.set ~ reply", reply)
            //     console.log("🚀 ~ file: JWT-service.js ~ line 27 ~ client.set ~ err", err)
            //     if (err) return reject(createError.InternalServerError())
            //     resolve(reply)
            //     console.log("🚀 ~ file: JWT-service.js ~ line 31 ~ client.set ~ reply", reply)
            // });
        })
    })
}

const signAccessRefreshToken = (refreshToken) => {
    return new Promise((resolve, reject) => {
        JWT.verify(refreshToken, process.env.REFERSH_KEY_TOKEN, (err, payload) => {
            if (err) reject(err);
            client.get(payload.userId, (err, reply) => {
                if (err) reject(createError.InternalServerError())
                if (reply === refreshToken) resolve(payload);
                reject(createError.Unauthorized())
            })
            resolve(payload);
        })
    })
}

const verifyAccessToken = (req, res, next) => {
    if (!req.headers['authorization']) return next(createError.Unauthorized())
    const authHeader = req.headers['authorization']
    const bearer = authHeader.split(' ');
    const token = bearer[1];
    JWT.verify(token, process.env.ACCESS_KEY_TOKEN, (err, payload) => {
        if (err) return next(createError.Unauthorized())
        req.payload = payload;
        next()
    })
}

module.exports = { signAccessToken, verifyAccessToken, signRefreshToken, signAccessRefreshToken };