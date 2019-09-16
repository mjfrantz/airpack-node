const express = require('express');
const morgan = require('morgan');
const packRouter = require('./routes/packRoutes');

const app = express();

app.use(express.json());

//Middleware 
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use((req, res, next) => {
    console.log('Hello from Middleware');
    next();
});

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

//Mounting the Router 
app.use('/api/v1/packs', packRouter);

module.exports = app;