const models = require("../../models");
const { sequelize } = require("../../models/index");

const getAllUsersHandler = async (req, res, next) => {
  const page = parseInt(req.query.page, 10);
  const limit = parseInt(req.query.per_page, 10);
  const offset = (page - 1) * limit;
  if (!page || !limit) {
    return res.status(400).json({
      message: "page, per_page 없음",
    });
  }
  if (res.locals.isAdmin) {
    try {
      const { count, rows } = await models.User.findAndCountAll({
        attributes: ["id", "nickname", "createdAt"],
        raw: true,
        order: sequelize.literal(`createdAt DESC`),
        offset,
        limit,
      });
      return res.status(200).json({
        count,
        rows,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  return res.status(403).end();
};

const getAllCommentsHandler = async (req, res, next) => {
  const page = parseInt(req.query.page, 10);
  const limit = parseInt(req.query.per_page, 10);
  const offset = (page - 1) * limit;
  if (!page || !limit) {
    return res.status(400).json({
      message: "page, per_page 없음",
    });
  }
  if (res.locals.isAdmin) {
    try {
      const { count, rows } = await models.Comment.findAndCountAll({
        attributes: ["id", "content", "createdAt"],
        include: [
          {
            model: models.User,
            attributes: ["nickname"],
            required: true,
          },
        ],
        group: ["Comment.id"],
        order: sequelize.literal(`Comment.createdAt ASC`),
        offset,
        limit,
      });
      return res.status(200).json({
        count: count.length,
        rows,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  return res.status(403).end();
};

module.exports = {
  getAllCommentsHandler,
  getAllUsersHandler,
};
