const { Op } = require("sequelize");
const { sequelize } = require("../../models/index");
const models = require("../../models/index");

const { getAllBeearsByPage, getTwelveBeersById } = require("../punk");

/*별점 조회*/
const calculateAllRates = async (offset, limit, next) => {
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
      offset,
      limit,
    });
    return new Promise((resolve) => {
      return resolve(ratedData);
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

/*별점 상위 12개 맥주 조회*/
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

/*
모든 맥주 조회
  - 기능: isPreferenceOrRateChecked 여부에 따라 
    - 선호 맥주 선택 페이지에서 보여질 맥주 데이터만 조회
    - 전체 맥주 페이지에서 보여질 맥주 데이터와 평점만 조회
*/
const getAllBeersHandler = async (req, res, next) => {
  const page = parseInt(req.query.page);
  const per_page = parseInt(req.query.per_page);
  const isPreferenceOrRateChecked = req.query.isPreferenceOrRateChecked;

  if (!page || !per_page) {
    return res.status(400).json({
      message: "page, per_page 없음",
    });
  }
  if (isPreferenceOrRateChecked == undefined) {
    return res.status(400).json({
      message: "isPreferenceOrRateChecked 없음",
    });
  }
  const beers = await getAllBeearsByPage(page, per_page, next);

  if (isPreferenceOrRateChecked === "false") {
    return res.json(beers.data);
  } else {
    const offset = (page - 1) * per_page;
    const rates = await calculateAllRates(offset, per_page, next);
    return res.json({
      rates,
      beers: beers.data,
    });
  }
};

/* 
별점 상위 12개 맥주 조회
  - 기능: 상위 12개 맥주와 별점 조회 
    - rates 테이블의 상위 12개 별점 맥주 아이디 조회
    - 조회한 아이디를 토대로 맥주 데이터 조회
*/
const getTop12Handler = async (req, res, next) => {
  try {
    const beerAvgs = await calculateTop12Rates(req, res, next);
    const beerIdsArr = beerAvgs.map((beer) => {
      return beer.beerId;
    });
    const beers = await getTwelveBeersById(beerIdsArr, next);

    return res.json({
      beerAvgs,
      beers: beers.data,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = {
  getAllBeersHandler,
  getTop12Handler,
};
