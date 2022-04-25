const models = require("../../../models");
/*
댓글 생성
*/
const createCommentHandler = async (req, res, next) => {
  if (!req.params.beerId || !req.body.content) {
    return res.status(400).json({
      message: "beerId 또는 content 없음",
    });
  }
  try {
    await models.Comment.create({
      userId: res.locals.id,
      beerId: req.params.beerId,
      content: req.body.content,
    });
    return res.status(201).end();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

/*
  댓글 수정
*/
const updateCommentHandler = async (req, res, next) => {
  if (!req.params.commentId || !req.body.content) {
    return res.status(400).json({
      message: "commentId 또는 content 없음",
    });
  }
  try {
    await models.Comment.update(
      {
        content: req.body.content,
      },
      {
        where: {
          id: req.params.commentId,
        },
      }
    );
    return res.status(204).end();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

/*
  댓글 삭제
*/
const deleteCommentHandler = async (req, res, next) => {
  try {
    if (res.locals.isAdmin) {
      const isDeleted = await models.Comment.destroy({
        where: {
          id: req.params.commentId,
        },
      });
      if (isDeleted) {
        return res.status(200).json({
          message: `어드민 댓글${req.params.commentId} 강제 삭제`,
        });
      }
      return res.status(404).json({
        message: "어드민 댓글 삭제 실패",
      });
    } else {
      const isDeleted = await models.Comment.destroy({
        where: {
          id: req.params.commentId,
          userId: res.locals.id,
        },
      });
      if (isDeleted) {
        return res.status(204).end();
      }
      return res.status(404).json({
        message: "댓글 삭제 실패",
      });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = {
  createCommentHandler,
  updateCommentHandler,
  deleteCommentHandler,
};
