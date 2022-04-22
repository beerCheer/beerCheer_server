const express = require("express");
const router = express.Router();
const ctrl = require("./beer.ctrl");

router.post("/:beerId/rates");
router.patch("/:beerId/rates");
router.get("/rates", ctrl.getTop12Handler);
router.post("/:beerId/comments");
router.patch("/:beerId/comments");
router.delete("/:beerId/comments");

module.exports = router;
