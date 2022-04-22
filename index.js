const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const userRouter = require("./api/user");
const preferenceRouter = require("./api/preference");
const favoriteRouter = require("./api/favorite");
const beerRouter = require("./api/beer");
const signUp = require("./api/middlewares/signUp");
const OAuthHandler = require("./api/middlewares/OAuthHandler");
const isLoggedIn = require("./api/middlewares/isLoggedIn");

require("dotenv").config();

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.post("/oauth", signUp, OAuthHandler);
app.use("/users", isLoggedIn, userRouter);
app.use("/beers/rates", beerRouter); //isLoggedIn 미들웨어 필요없으므로 따로 분리
app.use("/beers/:beerId", beerRouter);
app.use("/beers", beerRouter);
app.use("/preferences", preferenceRouter);
app.use("/favorites", favoriteRouter);

app.use((err, req, res, next) => {
  console.log(err);
});

module.exports = app;
