const express = require("express");
const router = express.Router();
const ctrl = require("./beer.ctrl");

router.post("/:beerId/rates");
router.patch("/:beerId/rates");
router.get("/", ctrl.getAllBeersHandler);

module.exports = router;
