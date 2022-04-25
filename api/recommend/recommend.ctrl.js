const models = require("../../models");
const { Op } = require("sequelize");
const { getBeersByMalt } = require("../punk");

const getPreferenceBeersMaltsByUserId = async (req, res, next) => {
  const preferenceBeerMalts = await models.Preference.findAll({
    attributes: ["beerId", "malt", "quantity"],
    where: {
      userId: parseInt(res.locals.id, 10),
    },
    raw: true,
  });
  return new Promise((resolve) => {
    return resolve(preferenceBeerMalts);
  });
};

const getRatedBeerIdsAndMaltsByUserId = async (req, res, next) => {
  const beerIds = await models.Rate.findAll({
    attributes: ["beerId", "malt", "quantity"],
    where: {
      userId: parseInt(res.locals.id, 10),
      rate: {
        [Op.gte]: 4,
      },
    },
    group: ["beerId"],
    raw: true,
  });
  return new Promise((resolve) => {
    return resolve(beerIds);
  });
};

const recommendHandler = async (req, res, next) => {
  const values = await Promise.allSettled([
    getPreferenceBeersMaltsByUserId(req, res, next),
    getRatedBeerIdsAndMaltsByUserId(req, res, next),
  ]);

  const findHighesttMalt = (arr) => {
    const highestMalt = arr.reduce((acc, cur) => {
      if (Number(acc.quantity) < Number(acc.cur)) {
        return cur;
      }
      return acc;
    }).malt;
    return highestMalt;
  };

  // 유저가 4점 이상 매긴 맥주가 있는 경우는 이를 토대로 맥주 추천
  let highestMalt;
  if (values[1].value.length) {
    highestMalt = findHighesttMalt(values[1].value);
  }
  // 유저가 4점 이상 매긴 맥주가 없는 경우 선호 맥주를 토대로 추천
  if (!values[1].value.length) {
    highestMalt = findHighesttMalt(values[0].value);
  }

  const beers = await getBeersByMalt(highestMalt, next);

  const beersWithHighestMalt = [];
  for (let i = 0; i < beers.length; i++) {
    for (let j = 0; j < beers[i].ingredients.malt.length; j++) {
      if (beers[i].ingredients.malt[j].name === highestMalt) {
        beersWithHighestMalt.push(beers[i]);
      }
    }
  }

  const beersToRecommend = [];
  for (const beer of beersWithHighestMalt) {
    if (beer.ingredients.malt[0].name === highestMalt) {
      beersToRecommend.push(beer);
    }
  }

  return res.json(beersToRecommend);
};

module.exports = {
  recommendHandler,
};
