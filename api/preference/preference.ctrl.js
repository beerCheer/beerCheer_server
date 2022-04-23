const models = require("../../models");

const createPreference = async (req, res, next) => {
  try {
    await models.Preference.create({
      userId: res.locals.id,
      beerId,
      malt,
      quantity,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const updateIsPreferenceOrRateChecked = async (req, res, next) => {
  try {
    await models.User.update(
      {
        isPreferenceOrRateChecked: true,
      },
      {
        where: {
          userId: res.locals.id,
        },
      }
    );
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const preferenceHandler = async (req, res, next) => {
  try {
    await createPreference(req, res, next);
    await updateIsPreferenceOrRateChecked(req, res, next);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.export = preferenceHandler;
