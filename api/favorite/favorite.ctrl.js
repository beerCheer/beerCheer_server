const models = require("../../models");

const createFavoriteHandler = async (req, res, next) => {
  const beerId = req.body.beerId;
  if (!beerId) {
    return res.status(400).json({
      message: "beerId 없음",
    });
  }
  try {
    await models.Favorite.create({
      userId: parseInt(res.locals.id, 10),
      beerId,
    });
    return res.status(201).end();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const deleteFavoriteHandler = async (req, res, next) => {
  const beerId = parseInt(req.params.beerId, 10);
  if (!beerId) {
    return res.status(400).json({
      message: "beerId 없음",
    });
  }

  try {
    await models.Favorite.destroy({
      where: {
        beerId,
        userId: res.locals.id,
      },
    });
    return res.status(204).end();
  } catch (err) {
    console.log(err);
    next(err);
  }
};
module.exports = {
  createFavoriteHandler,
  deleteFavoriteHandler,
};
