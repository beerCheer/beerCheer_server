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
      beerId,
    });
    return res.status(201).end();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const deleteFavoriteHandler = async (req, res, next) => {
  const beerId = req.params.beerId;
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
  } catch (err) {
    console.log(err);
    next(err);
  }
};
module.exports = {
  createFavoriteHandler,
  deleteFavoriteHandler,
};
