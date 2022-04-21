const express = require("express");
const router = express.Router();
const ctrl = require("./user.ctrl");

router.post("/userInfo", ctrl.nicknameValidationCheck);
router.patch("/userInfo", ctrl.updateUserNickname);
router.post("/logout", ctrl.logoutUser);
router.delete("/", ctrl.deleteUser);
module.exports = router;
