const { Op } = require("sequelize");
const { sequelize } = require("../../models/index");
const models = require("../../models/index");

const { getAllBeearsByPage, getTwelveBeersById } = require("../punk");

const calculateTop12Rates = async (req, res, next) => {
  try {
    const ratedData = await models.Rate.findAll({
      attributes: [
        "beerId",
        [
          sequelize.fn("round", sequelize.fn("avg", sequelize.col("rate")), 2),
          "avg",
        ],
      ],
      group: ["Rate.beerId"],
      raw: true,
      order: sequelize.literal("avg DESC"),
      limit: 12,
    });
    return new Promise((resolve) => {
      return resolve(ratedData);
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const getTop12Handler = async (req, res, next) => {
  try {
    const beerAvgs = await calculateTop12Rates(req, res, next);
    const beerIdsArr = beerAvgs.map((beer) => {
      return beer.beerId;
    });
    const beers = await getTwelveBeersById(beerIdsArr, next);

    return res.json({
      beerAvgs,
      beers,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = {
  calculateTop12Rates,
  getTop12Handler,
};
