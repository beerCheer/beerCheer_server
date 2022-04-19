const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const userRouter = require("./api/user");
const preferenceRouter = require("./api/preference");
const favoriteRouter = require("./api/favorite");
const beerRouter = require("./api/beer");

require("dotenv").config();

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser);

app.use("/users", userRouter);
app.use("/beers", beerRouter);
app.use("/preferences", preferenceRouter);
app.use("/favorites", favoriteRouter);

module.exports = app;
