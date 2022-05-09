const { Op } = require("sequelize");
const { sequelize } = require("../../models/index");
const models = require("../../models/index");
const { getTwelveBeersById } = require("../punk/index");
const { getLikedBeersByUserId } = require("../beer/beer.ctrl");

/*유저 마이페이지 댓글 조회*/
const getMypageComments = async (req, res, next) => {
  try {
    console.log("what");
    const comments = await models.Comment.findAll({
      attributes: ["beerId", "content", "createdAt"],
      where: {
        userId: parseInt(res.locals.id, 10),
      },
      order: sequelize.literal(`Comment.beerId ASC`),
      raw: true,
    });
    if (comments.length === 0) {
      return res.json({
        message: "댓글 없음",
      });
    }
    const beerIdsArr = comments.map((comment) => {
      return comment.beerId;
    });
    const beers = await getTwelveBeersById(beerIdsArr, next);
    let commentIdx = 0;
    beers.map((beer) => {
      if (beer.id === comments[commentIdx].beerId) {
        comments[commentIdx].beerName = beer.name;
        commentIdx++;
      }
      return beer;
    });

    return res.json({
      totalResults: comments.length,
      result: comments,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

/*유저 마이페이지 보관 맥주 조회*/
const getMypageFavoriteBeers = async (req, res, next) => {
  try {
    const favoriteBeerIds = await getLikedBeersByUserId(
      parseInt(res.locals.id, 10),
      next
    );

    if (favoriteBeerIds.length === 0) {
      return res.json({
        message: "보관한 맥주 없음",
      });
    }
    const beerIdsArr = favoriteBeerIds.map((beer) => {
      return beer.beerId;
    });
    const beers = await getTwelveBeersById(beerIdsArr, next);
    for (const beer of beers) {
      beer.favorite = true;
    }
    const avgs = await models.Rate.findAll({
      attributes: [
        "beerId",
        [
          sequelize.fn("round", sequelize.fn("avg", sequelize.col("rate")), 2),
          "avg",
        ],
      ],
      where: {
        beerId: beerIdsArr,
      },
      group: ["Rate.beerId"],
      raw: true,
    });

    if (avgs.length === 0) {
      return res.json({
        totalResults: beers.length,
        result: beers,
      });
    }
    const beersWithAvgs = beers.map((beer) => {
      if (beer.id === avgs[0].beerId) {
        beer.avg = Number(avgs[0].avg);
        avgs.shift();
      }
      return beer;
    });
    return res.json({
      totalResults: beersWithAvgs.length,
      result: beersWithAvgs,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

/*유저 마이페이지 별점 맥주 조회*/
const getMypageRatedBeers = async (req, res, next) => {
  try {
    // 유저가 별점 매긴 맥주 아이디와 별점
    const ratedBeerIdsAndRates = await models.Rate.findAll({
      attributes: ["beerId", "rate"],
      where: {
        userId: parseInt(res.locals.id, 10),
      },
      order: sequelize.literal("beerId ASC"),
      raw: true,
    });
    console.log("유저가 별점 남긴 맥주아이디와 별점", ratedBeerIdsAndRates);

    if (ratedBeerIdsAndRates.length === 0) {
      return res.json({
        message: "별점 남긴 맥주 없음",
      });
    }

    // 유저가 보관한 맥주 아이디
    const favoriteBeerIds = await getLikedBeersByUserId(
      parseInt(res.locals.id, 10),
      next
    );

    // 유저가 별점 매긴 맥주 아이디
    const beerIdsArr = ratedBeerIdsAndRates.map((ratedBeer) => {
      return ratedBeer.beerId;
    });
    const ratesArr = ratedBeerIdsAndRates.map((ratedBeer) => {
      return ratedBeer.rate;
    });

    // 유저가 별점 매긴 맥주 데이터
    const beers = await getTwelveBeersById(beerIdsArr, next);

    const beersWithAvg = beers.map((beer) => {
      beer.avg = Number(ratesArr[0]);
      ratesArr.shift();
      if (favoriteBeerIds.length && beer.id === favoriteBeerIds[0].beerId) {
        beer.favorite = true;
        favoriteBeerIds.shift();
      }
      return beer;
    });

    return res.json({
      totalResults: beersWithAvg.length,
      result: beersWithAvg,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

/*유저 정보 조회*/
const getUser = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    if (userId === res.locals.id) {
      const userData = await models.User.findOne({
        attributes: [
          "id",
          "nickname",
          "email",
          "isPreferenceOrRateChecked",
          "isAdmin",
        ],
        where: {
          id: userId,
        },
        raw: true,
      });
      return res.json(userData);
    }
    return res.status(403).end();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

/*유저 로그아웃*/
const logoutUser = (req, res, next) => {
  try {
    res.clearCookie("accessToken", { path: "/" });
    return res.status(205).end();
  } catch (err) {
    next(err);
  }
};

/*유저 정보 변경*/
const nicknameValidationCheck = (req, res, next) => {
  if (!req.body.nickname) {
    return res.status(400).json({
      message: "닉네임 없음",
    });
  }
  models.User.findOne({
    where: {
      nickname: req.body.nickname,
    },
  })
    .then((userData) => {
      if (userData) {
        return res.json({
          message: "사용중인 닉네임",
        });
      } else {
        return res.json({
          message: "사용가능한 닉네임",
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

const updateUserNickname = async (req, res, next) => {
  if (!req.body.nickname) {
    return res.status(400).json({
      message: "닉네임 없음",
    });
  }

  models.User.update(
    { nickname: req.body.nickname },
    {
      where: {
        id: res.locals.id,
      },
    }
  )
    .then(() => {
      return res.status(204).end();
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

/*유저 탈퇴*/
const deleteUser = async (req, res, next) => {
  if (res.locals.isAdmin) {
    try {
      const id = parseInt(req.query.id, 10);
      if (!id) {
        return res.status(400).json({
          message: "id 없음",
        });
      }
      await models.User.destroy({
        where: {
          id,
        },
      });
      return res.status(200).json({
        message: `유저${id} 강제탈퇴`,
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  try {
    await models.User.destroy({
      where: {
        id: res.locals.id,
      },
    });
    return res.status(204).end();
  } catch (err) {
    next(err);
  }
};

const updateIsPreferenceOrRateChecked = async (req, res, next) => {
  const userId = res.locals.id;
  const IsPreferenceOrRateChecked = await models.User.update(
    {
      isPreferenceOrRateChecked: true,
    },
    {
      where: {
        id: userId,
      },
    }
  );
  if (IsPreferenceOrRateChecked) {
    return res.status(204).end();
  }
  return res.status(400).json({
    message: "isPreferencerRateChecked 변경 실패",
  });
};
module.exports = {
  logoutUser,
  nicknameValidationCheck,
  updateUserNickname,
  deleteUser,
  getUser,
  getMypageRatedBeers,
  getMypageFavoriteBeers,
  getMypageComments,
  updateIsPreferenceOrRateChecked,
};
