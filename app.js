const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const packRouter = require("./routes/packRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

app.use(cors());

app.use(express.json());

//Global Middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

//Allow 200 request from one IP in one hour 
const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!' 
});
app.use('/api', limiter);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);
  next();
});

//Mounting the Router
app.use("/api/v1/packs", packRouter);
app.use("/api/v1/users", userRouter);

app.all('*', (req, res, next) => {

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;