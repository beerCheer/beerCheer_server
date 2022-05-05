const models = require("../../models");

const findHighestMalt = (beers) => {
  const highestMalt = beers.reduce((prev, cur) => {
    if (prev.quantity < cur.quantity) {
      return cur;
    } else {
      return prev;
    }
  });
  return highestMalt;
};

const createPreference = async (beer, next) => {
  //console.log("createPreference의 res.locals.id: ", res.locals.id);

  try {
    await models.Preference.create({
      //userId: res.locals.id,
      beerId: beer.beerId,
      malt: beer.malt,
      quantity: beer.quantity,
    });
  } catch (err) {
    console.log(err);
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
  if (!req.body.beers) {
    return res.status(400).json({
      message: "beers 없음",
    });
  }
  try {
    const highestMaltData = findHighestMalt(req.body.beers);
    await createPreference(highestMaltData, next);
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
