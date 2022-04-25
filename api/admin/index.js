const express = require("express");
const router = express.Router();
const ctrl = require("./admin.ctrl");

router.get("/comments", ctrl.getAllCommentsHandler);
router.get("/users", ctrl.getAllUsersHandler);

module.exports = router;
