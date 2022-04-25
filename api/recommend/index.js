const express = require("express");
const router = express.Router();
const ctrl = require("./recommend.ctrl");

router.get("/", ctrl.recommendHandler);

module.exports = router;
