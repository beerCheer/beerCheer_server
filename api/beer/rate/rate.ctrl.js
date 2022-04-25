const models = require("../../../models");

const createRateHandler = async (req, res, next) => {
  if (!req.params.beerId || !req.body.rate) {
    return res.json({
      message: "beerId 또는 rate 없음",
    });
  }
  try {
    await models.Rate.create({
      userId: res.locals.id,
      beerId: parseInt(req.params.beerId, 10),
      rate: parseInt(req.body.rate, 10),
    });
    await models.User.update(
      {
        isPreferenceOrRateChecked: true,
      },
      {
        where: {
          id: parseInt(res.locals.id, 10),
        },
      }
    );
    return res.status(201).end();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const updateRateHandler = async (req, res, next) => {
  if (!req.params.beerId || !req.body.rate) {
    return res.status(400).json({
      message: "beerId 또는 rate 없음",
    });
  }
  try {
    await models.Rate.update(
      {
        rate: req.body.rate,
      },
      {
        where: {
          userId: res.locals.id,
          beerId: parseInt(req.params.beerId, 10),
        },
      }
    );
    return res.status(204).end();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = {
  createRateHandler,
  updateRateHandler,
};
