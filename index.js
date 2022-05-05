const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
const userRouter = require("./api/user");
const preferenceRouter = require("./api/preference");
const favoriteRouter = require("./api/favorite");
const beerRouter = require("./api/beer");
const adminRouter = require("./api/admin");
const recommendationRouter = require("./api/recommend");
//const commentRouter = require("./api/beer/comment");
const signUp = require("./api/middlewares/signUp");
const OAuthHandler = require("./api/middlewares/OAuthHandler");
const kakaoLogin = require("./api/middlewares/naverLogin");
const isLoggedIn = require("./api/middlewares/isLoggedIn");
const naverLogin = require("./api/middlewares/naverLogin");

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

app.post("/naver", naverLogin, signUp, OAuthHandler);
app.post("/kakao", kakaoLogin, signUp, OAuthHandler);
app.use("/users", isLoggedIn, userRouter);
app.use("/beers", beerRouter);
app.use("/admin", isLoggedIn, adminRouter);
app.use("/recommendations", isLoggedIn, recommendationRouter);
//app.use("/comments", isLoggedIn, commentRouter);
app.use("/preferences", isLoggedIn, preferenceRouter);
//app.use("/preferences", preferenceRouter);
app.use("/favorites", isLoggedIn, favoriteRouter);

app.use((err, req, res, next) => {
  console.log(err);
});

module.exports = app;
