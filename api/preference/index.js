const express = require("express");
const router = express.Router();
const ctrl = require("./preference.ctrl");

router.post("/", ctrl.preferenceHandler);

module.exports = router;
