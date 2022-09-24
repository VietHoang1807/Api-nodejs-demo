const express = require('express');
const cors = require('cors');
const app = express();
const httpErrors = require('http-errors');
const userRouter = require('./Route/User.route');

var corsOptions = {
    origin: "http://localhost:4200"
};
require('dotenv').config();
app.use(cors(corsOptions));
app.get('/', (req,res,next) => {
    res.send('Hello World Nodejs')
})
app.use(express.json());
app.use(express.urlencoded({ extended: true}))
app.use('/user',userRouter);

app.use((req,res,next) => {
    next(httpErrors.NotFound('This route does not exists'))
})

app.use((err,req,res,next) => {
    res.json( {
        status: err.status,
        message: err.message
    })
})

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`server run ${PORT}`);
})