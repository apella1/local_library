const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");
const helmet = require("helmet");

const catalogRouter = require("./routes/catalog");

const app = express();

// connecting to mongodb

const devDbUrl =
  "mongodb+srv://Koda:jhavp5XvfYNtm7uF@cluster0.jaxhkop.mongodb.net/local_library?retryWrites=true&w=majority";

const mongoDB = process.env.MONGO_URL || devDbUrl;

mongoose.set("strictQuery", false);
main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoDB);
}

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression());
app.use(helmet());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", catalogRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
