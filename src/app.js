const express = require("express");
const { default: helmet } = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const app = express();

// init middlewares

app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
// init db
require("./db/init.mongodb");
const { checkOverLoad } = require("./helpers/check.connect");
checkOverLoad();
// init router
app.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Welcome",
  });
});
// handling error

module.exports = app;
