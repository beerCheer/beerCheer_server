const express = require("express");
const router = express.Router();
const ctrl = require("./user.ctrl");

router.get("/mypage/beers", ctrl.getMypageRatedBeers);
router.get("/mypage/favorites", ctrl.getMypageFavoriteBeers);
router.get("/mypage/comments", ctrl.getMypageComments);
router.get("/:userId", ctrl.getUser);
router.post("/userInfo", ctrl.nicknameValidationCheck);
router.patch("/userInfo", ctrl.updateUserNickname);
router.post("/logout", ctrl.logoutUser);
router.delete("/", ctrl.deleteUser);

module.exports = router;
