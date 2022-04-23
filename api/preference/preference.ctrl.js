const models = require("../../models");

const createPreference = async (req, res, next) => {
  //console.log("createPreference의 res.locals.id: ", res.locals.id);
  try {
    await models.Preference.create({
      userId: res.locals.id,
      beerId: req.body.beerId,
      malt: req.body.malt,
      quantity: req.body.quantity,
    });
  } catch (err) {
    console.log("hello error", err);
    next(err);
  }
};

const updateIsPreferenceOrRateChecked = async (req, res, next) => {
  console.log(
    "updateIsPreferenceOrRateChecked의 res.locals.id: ",
    res.locals.id
  );
  try {
    console.log("updateIsPreferenceOrRateChecked: ", res.locals.id);
    await models.User.update(
      {
        isPreferenceOrRateChecked: true,
      },
      {
        where: {
          id: res.locals.id,
        },
      }
    );
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const preferenceHandler = async (req, res, next) => {
  if (!req.body.beerId || !req.body.malt || !req.body.quantity) {
    return res.status(400).json({
      message: "beerId, malt 또는 quantity 없음",
    });
  }
  try {
    await createPreference(req, res, next);
    await updateIsPreferenceOrRateChecked(req, res, next);

    return res.status(201).json({
      isPreferenceOrRateChecked: true,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = { preferenceHandler };
