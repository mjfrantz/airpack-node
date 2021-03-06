const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const packRouter = require('./routes/packRoutes');
const userRouter = require('./routes/userRoutes');
const mailRouter = require('./routes/mailRoutes');
const reviewRouter = require('./routes/reviewRoutes');

const app = express();

app.use(cors());

//Global Middleware

//Body parser, reading data from body into req.body
app.use(express.json({ limit: '50kb' }));
app.use(cookieParser());

//Data sanitization again NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

// Prevent Parameter Pollution (**Might need to add this for the other models!)
app.use(
  hpp({
    whitelist: ['price', 'type', 'size', 'length']
  })
);

//Set Security HTTP Headers
app.use(helmet());

//Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//Limit request from same API (Allow 200 request from one IP in one hour)
const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

//Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  //console.log(req.cookies);
  next();
});

//Mounting the Router
app.use('/api/v1/packs', packRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/mail', mailRouter);
app.use('/api/v1/reviews', reviewRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
