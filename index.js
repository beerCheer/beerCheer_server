const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const userRouter = require("./api/user");
const preferenceRouter = require("./api/preference");
const favoriteRouter = require("./api/favorite");
const beerRouter = require("./api/beer");
const commentRouter = require("./api/comment");
const signUp = require("./api/middlewares/signUp");
const OAuthHandler = require("./api/middlewares/OAuthHandler");
const isLoggedIn = require("./api/middlewares/isLoggedIn");
const { getTop12Handler } = require("./api/beer/beer.ctrl");
const { getAllCommentsByBeerId } = require("./api/beer/beer.ctrl");
const { getAllBeersHandler } = require("./api/beer/beer.ctrl");
const { favoriteBeerHandler } = require("./api/beer/beer.ctrl");
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
app.get("/beers/rates", getTop12Handler); //isLoggedIn 미들웨어 필요없으므로 따로 분리
app.get("/beers/:beerId/comments", getAllCommentsByBeerId);
app.get("/beers/:beerId/favorites", isLoggedIn, favoriteBeerHandler);
app.get("/beers", getAllBeersHandler);
app.use("/comments", isLoggedIn, commentRouter);
app.use("/preferences", isLoggedIn, preferenceRouter);
app.use("/favorites", isLoggedIn, favoriteRouter);

app.use((err, req, res, next) => {
  console.log(err);
});

module.exports = app;
