const express = require("express");
const router = express.Router();
const ctrl = require("./favorite.ctrl");

router.post("/", ctrl.createFavoriteHandler);
router.delete("/:beerId", ctrl.deleteFavoriteHandler);
module.exports = router;
