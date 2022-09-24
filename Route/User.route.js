const express = require('express');
const route = express.Router();
const createErrors = require('http-errors');
const User = require('../Models/User.model');
const { userValidate } = require('../Helpers/validation');
const { signAccessToken, verifyAccessToken, signRefreshToken, signAccessRefreshToken } = require('../Helpers/JWT-service');

route.post('/register', async (req, res, next) => {
    try {
        console.log(req.body);
        const { email, password, department, localtion, address } = req.body;
        // if (!email || !password) {
        //     throw createErrors.BadRequest();
        // }

        const { error } = userValidate({ email, password });

        if (error) {
            throw createErrors(error.details[0].message);
        }

        const isExists = await User.findOne({ email })
        if (isExists) {
            throw createErrors.Conflict(`${email} is ready been register`);
        }
        const newUser = new User({ email, password, department, localtion, address })
        const isSave = await newUser.save();
        const accessToken = await signAccessToken(user._id);
        const refreshToken = await signRefreshToken(user._id);
        return res.json({
            status: 'Ok',
            element: isSave,
            accessToken,
            refreshToken
        })
    } catch (err) {
        next(err);
    }
})

route.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const { error } = userValidate(req.body);
        if (error) {
            throw createErrors(error.details[0].message);
        }

        const user = await User.findOne({ email })
        if (!user) {
            throw createErrors.NotFound('Email does register');
        }

        const isCheckPass = await user.isCheckPassword(password);
        if (!isCheckPass) { throw createErrors.Unauthorized() }
        const accessToken = await signAccessToken(user._id);
        console.log("🚀 ~ file: User.route.js ~ line 57 ~ route.post ~ accessToken", accessToken)
        const refreshToken = await signRefreshToken(user._id);
        console.log("🚀 ~ file: User.route.js ~ line 59 ~ route.post ~ refreshToken", refreshToken)
        return res.json({
            status: 'Ok',
            accessToken,
            refreshToken
        })
    } catch (err) {
        next(err);
    }
})

route.post('/searchUser', verifyAccessToken, async (req, res, next) => {
    try {
        const { email, department } = req.body;
        const lstUser = await User.find();
        const lst = lstUser.map(e => {
            return e;
        })
        return res.json(lst);
    } catch (err) {
        next(err);
    }
})

route.post('/updateUser', verifyAccessToken, async (req, res, next) => {
    try {
        const { _id, email, department, address, localtion } = req.body;
        console.log("🚀 ~ file: User.route.js ~ line 86 ~ route.post ~ req.body", req.body)
        const isExists = await User.findOne({_id});
        console.log("🚀 ~ file: User.route.js ~ line 87 ~ route.post ~ isExists", isExists)
        if (!isExists) throw createErrors('User not found');
        const saveUser = await User.findByIdAndUpdate(_id, {department, address, localtion}, {new: true})
        console.log("🚀 ~ file: User.route.js ~ line 89 ~ route.post ~ saveUser", saveUser)
        return res.json({ status: "Ok", saveUser });
    } catch (err) {
        next(err);
    }
})

route.delete('/', verifyAccessToken, async (req, res, next) => {
    try {
        const { id } = req.body;
        const username = await User.findOne({ _id: id });
        console.log("🚀 ~ file: User.route.js ~ line 89 ~ route.delete ~ username", username)
        if (!username) createErrors('user not found, try again');
        const userDelete = await User.findByIdAndDelete({ _id: id });
        return res.json({ status: 'Ok', userDelete })
    } catch (err) {
        next(err);
    }
})

route.post('/logout', async (req, res, next) => {
    try {
        // const { id } = req.body;
        // console.log("🚀 ~ file: User.route.js ~ line 104 ~ route.post ~ req.body", req.body)
        // console.log("🚀 ~ file: User.route.js ~ line 104 ~ route.post ~ id", id)
        // const del = await redis.get(`access${id}`);
        // console.log("🚀 ~ file: User.route.js ~ line 107 ~ route.post ~ del", del)

        // const del = await redis.del(`access ${id}`);
        // console.log("🚀 ~ file: User.route.js ~ line 106 ~ route.post ~ del", del)
        return res.json({
            element: "Ok"
        })
    } catch (err) {
        next(err);
    }
})

route.post('/refresh-token', async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) throw createErrors.BadRequest();
        const { userid } = await signAccessRefreshToken(refreshToken);
        const accessToken = await signAccessToken(userid);
        const refreToken = await signRefreshToken(userid);
        return res.json({
            status: 'Ok',
            accessToken,
            refreshToken: refreToken
        })
    } catch (err) {
        next(err);
    }
})

module.exports = route;