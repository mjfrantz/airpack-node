const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const packRouter = require("./routes/packRoutes");

const app = express();

app.use(cors());

app.use(express.json());

//Middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//Mounting the Router
app.use("/api/v1/packs", packRouter);

app.all('*', (req, res, next) => {

  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;