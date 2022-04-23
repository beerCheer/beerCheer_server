const express = require("express");
const router = express.Router();
const ctrl = require("./comment.ctrl");

router.post("/", ctrl.createCommentHandler);
router.patch("/:commentId", ctrl.updateCommentHandler);
router.delete("/:commentId", ctrl.deleteCommentHandler);

module.exports = router;
