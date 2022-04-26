const express = require("express");
const isLoggedIn = require("../middlewares/isLoggedIn");
const router = express.Router();
const ctrl = require("./beer.ctrl");
const commentctrl = require("./comment/comment.ctrl");
const ratectrl = require("./rate/rate.ctrl");

router.post("/:beerId/rates", isLoggedIn, ratectrl.createRateHandler);
router.patch("/:beerId/rates", isLoggedIn, ratectrl.updateRateHandler);
router.get("/rates", ctrl.getTop12Handler);
router.get("/", ctrl.getAllBeersHandler);
router.get("/search", ctrl.getBeersByNameHandler);
router.get("/:beerId/comments", ctrl.getAllCommentsByBeerId);
router.get("/:beerId/favorites", isLoggedIn, ctrl.favoriteBeerHandler);
router.get("/:beerId/rates", isLoggedIn, ctrl.ratedBeerHandler);
router.post("/:beerId/comments", isLoggedIn, commentctrl.createCommentHandler);
router.patch(
  "/comments/:commentId",
  isLoggedIn,
  commentctrl.updateCommentHandler
);
router.delete(
  "/comments/:commentId",
  isLoggedIn,
  commentctrl.deleteCommentHandler
);

module.exports = router;
