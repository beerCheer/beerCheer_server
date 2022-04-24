const express = require("express");
const router = express.Router();
const ctrl = require("./favorite.ctrl");

router.post("/", ctrl.createFavoriteHandler);
router.delete("/", ctrl.deleteFavoriteHandler);
module.exports = router;
