const { Op } = require("sequelize");
const { sequelize } = require("../../models/index");
const models = require("../../models/index");

const {
  getAllBeearsByPage,
  getTwelveBeersById,
  getBeersByName,
  getBeerById,
} = require("../punk");

/*맥주 아이디의 평균 별점 조회*/
const calculateRate = async (beerId, next) => {
  try {
    const ratedData = await models.Rate.findOne({
      attributes: [
        "beerId",
        [
          sequelize.fn("round", sequelize.fn("avg", sequelize.col("rate")), 2),
          "avg",
        ],
      ],
      where: {
        beerId,
      },
      group: ["Rate.beerId"],
      raw: true,
    });
    return new Promise((resolve) => {
      return resolve(ratedData);
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

/*맥주 아이디별 평균 별점 조회*/
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

/*유저가 보관한 맥주 아이디 조회*/
const getLikedBeersByUserId = async (userId, next) => {
  try {
    const likedData = await models.Favorite.findAll({
      where: {
        userId,
      },
      attributes: ["beerId"],
      order: sequelize.literal("beerId ASC"),
      raw: true,
    });
    return new Promise((resolve) => {
      return resolve(likedData);
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const getLikedBeerByUserIdAndBeerId = async (userId, beerId, next) => {
  try {
    const likedData = await models.Favorite.findOne({
      where: {
        userId,
        beerId,
      },
      attributes: ["beerId", "userId"],
      raw: true,
    });
    return new Promise((resolve) => {
      return resolve(likedData);
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

/*
맥주 아이디로 맥주 데이터 조회
  - 기능: 맥주 디테일 페이지에 맥주 데이터 사용
    - 맥주 데이터
    - 평균 별점
    - 유저의 별점 (로그인한 경우)
    - 하트여부 (로그인한 경우) 
*/
const getBeerByBeerIdHandler = async (req, res, next) => {
  const beerId = parseInt(req.params.beerId, 10);
  const userId = parseInt(req.query.id, 10);

  try {
    const values = await Promise.allSettled([
      getBeerById(beerId, next),
      calculateRate(beerId, next),
    ]);

    const avg = values[1].value ? Number(values[1].value.avg) : 0;

    if (userId) {
      const like = await getLikedBeerByUserIdAndBeerId(userId, beerId, next);
      const userRate = await models.Rate.findOne({
        attributes: ["rate"],
        where: {
          userId,
          beerId,
        },
        raw: true,
      });

      const favorite = like ? true : false;
      const rate = userRate ? userRate.rate : null;
      return res.json({
        beer: values[0].value[0],
        avg,
        favorite,
        rate,
      });
    }

    return res.json({
      beer: values[0].value[0],
      avg: rate,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

/*
맥주 이름으로 검색
  - 기능: OpenAPI에 이름으로 맥주 조회 
    - 맥주 데이터와 평점, 하트 여부 
*/
const getBeersByNameHandler = async (req, res, next) => {
  const name = req.query.name;
  const userId = parseInt(req.query.id, 10);
  try {
    const beers = await getBeersByName(name, next);
    const offset = 0;
    const limit = beers.length;
    const rates = await calculateAllRates(offset, limit, next);
    let rateIdx = 0;
    let beerRateArr = beers.map((beer) => {
      if (beer.id === rates[rateIdx].beerId) {
        beer.avg = Number(rates[rateIdx].avg);
        rateIdx++;
      }
      return beer;
    });

    if (userId) {
      const likes = await getLikedBeersByUserId(userId, next); //[ { beerId: 7 } ]
      if (likes.length === 0) {
        return res.json({
          totalResults: beerRateArr.length,
          result: beerRateArr,
        });
      }
      const beerRateLikesArr = beerRateArr.map((beer) => {
        if (beer.id === likes[0].beerId) {
          beer.favorite = true;
          likes.shift();
        }
        return beer;
      });
      return res.json({
        totalResults: beerRateLikesArr.length,
        result: beerRateLikesArr,
      });
    }
    return res.json({ totalResults: beerRateArr.length, result: beerRateArr });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

/*
모든 맥주 조회
  - 기능: isPreferenceOrRateChecked에 따라 
    - 선호 맥주 선택 페이지에서 보여질 맥주 데이터만 조회
    - 전체 맥주 페이지에서 보여질 맥주 데이터와 평점만 조회
*/
const getAllBeersHandler = async (req, res, next) => {
  const page = parseInt(req.query.page);
  const per_page = parseInt(req.query.per_page);
  // const name = req.query.name;
  const isPreferenceOrRateChecked = req.query.isPreferenceOrRateChecked;
  const userId = parseInt(req.query.id, 10);

  // if (isPreferenceOrRateChecked == undefined) {
  //   return res.status(400).json({
  //     message: "isPreferenceOrRateChecked 없음",
  //   });
  // }
  if (!page || !per_page) {
    return res.status(400).json({
      message: "page, per_page 없음",
    });
  }
  try {
    const beers = await getAllBeearsByPage(page, per_page, next);

    if (isPreferenceOrRateChecked === "false") {
      return res.json(beers);
    } else {
      const offset = (page - 1) * per_page;
      const rates = await calculateAllRates(offset, per_page, next);
      const totalResults = 325;
      const totalPages = Math.ceil(totalResults / per_page);
      let rateIdx = 0;

      const beerRateArr = beers.map((beer) => {
        if (rates.length && beer.id === rates[rateIdx].beerId) {
          beer.avg = Number(rates[rateIdx].avg);
          rateIdx++;
        }
        return beer;
      });
      if (userId) {
        const likes = await getLikedBeersByUserId(userId, next);
        if (likes.length === 0) {
          return res.json({
            page,
            totalPages,
            totalResults,
            result: beerRateArr,
          });
        }
        let likeIdx = 0;

        const beerRateLikesArr = beerRateArr.map((beer) => {
          if (likeIdx < likes.length && beer.id === likes[likeIdx].beerId) {
            beer.favorite = true;
            likeIdx++;
          }
          return beer;
        });
        return res.json({
          page,
          totalPages,
          totalResults,
          result: beerRateLikesArr,
        });
      }
      return res.json({
        page,
        totalPages,
        totalResults,
        result: beerRateArr,
      });
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
      attributes: ["id", "content", "createdAt"],
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
      //group: ["Comment.beerId"],
      order: sequelize.literal(`Comment.createdAt ASC`),
      offset,
      limit,
      raw: true,
    });
    const totalPages = Math.ceil(count / limit);
    return res.json({ page, totalResults: count, totalPages, result: rows });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

/* 
로그인한 유저가 특정 아이디의 맥주 보관(하트) 여부 조회
  - 기능: 
    - favorites 테이블에서 로그인한 유저 아이디의 보관 여부 조회
*/
const favoriteBeerHandler = async (req, res, next) => {
  const beerId = parseInt(req.params.beerId, 10);
  const userId = res.locals.id;
  if (!beerId) {
    return res.status(400).json({
      message: "beerId 없음",
    });
  }
  try {
    const favoriteBeer = await models.Favorite.findOne({
      where: {
        beerId,
        userId,
      },
      raw: true,
    });
    if (favoriteBeer) {
      return res.json({
        isFavoriteBeer: true,
      });
    } else {
      return res.json({
        isFavoriteBeer: false,
      });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

/* 
로그인한 유저가 특정 아이디의 맥주 매긴 평점 조회
  - 기능: 
    - rates 테이블에서 로그인한 유저 아이디의 맥주 평점 조회
*/
const ratedBeerHandler = async (req, res, next) => {
  try {
    const beerId = parseInt(req.params.beerId, 10);
    const userId = res.locals.id;

    if (!beerId) {
      return res.status(400).json({
        message: "beerId 없음",
      });
    }

    const beerRate = await models.Rate.findOne({
      attributes: ["rate"],
      where: {
        beerId,
        userId,
      },
      raw: true,
    });
    if (beerRate) {
      return res.json({
        isBeerRated: true,
        avg: beerRate.rate,
      });
    }
    return res.json({
      isBeerRated: false,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = {
  getAllBeersHandler,
  getTop12Handler,
  getAllCommentsByBeerId,
  favoriteBeerHandler,
  ratedBeerHandler,
  getBeersByNameHandler,
  getBeerByBeerIdHandler,
  getLikedBeersByUserId,
  calculateAllRates,
  calculateRate,
};
