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
      order: sequelize.literal("beerId ASC"),
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
  try {
    const beers = await getAllBeearsByPage(page, per_page, next);

    if (isPreferenceOrRateChecked === "false") {
      return res.json(beers);
    } else {
      const offset = (page - 1) * per_page;
      const rates = await calculateAllRates(offset, per_page, next);
      let rateIdx = 0;
      const beerRateArr = beers.map((beer) => {
        if (beer.id === rates[rateIdx].beerId) {
          beer.avg = Number(rates[rateIdx].avg);
          rateIdx++;
        }
        return beer;
      });

      return res.json(beerRateArr);
    }
  } catch (err) {
    console.log(err);
    next(err);
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
    let rateIdx = 0;
    const beerRateArr = beers.map((beer) => {
      beer.avg = Number(beerAvgs[rateIdx].avg);
      rateIdx++;
      return beer;
    });
    return res.json(beerRateArr);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

/* 
특정 아이디의 맥주의 댓글 조회
  - 기능: 
    - 특정 맥주 아이디에 대한 모든 댓글 조회
*/

const getAllCommentsByBeerId = async (req, res, next) => {
  const beerId = parseInt(req.params.beerId, 10);
  const page = parseInt(req.query.page, 10);
  const limit = parseInt(req.query.per_page, 10);
  if (!beerId || !page || !limit) {
    return res.status(400).json({
      message: "beerId, page 또는 per_page 없음",
    });
  }

  const offset = (page - 1) * limit;
  try {
    const { count, rows } = await models.Comment.findAndCountAll({
      attributes: ["content", "createdAt"],
      where: {
        beerId,
      },
      include: [
        {
          model: models.User,
          attributes: ["nickname"],
          required: true,
        },
      ],
      group: ["Comment.beerId"],
      order: sequelize.literal(`Comment.createdAt ASC`),
      offset,
      limit,
    });
    return res.json({ count: count.length, rows });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = {
  getAllBeersHandler,
  getTop12Handler,
  getAllCommentsByBeerId,
};
