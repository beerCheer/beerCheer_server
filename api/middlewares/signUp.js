const { Op } = require("sequelize");
const models = require("../../models/index");

const signUp = async (req, res, next) => {
  let nickname;
  let email;
  if (req.path === "/kakao") {
    nickname = res.locals.kakao.kakako_account.profile.nickname;
    email = res.locals.kakao.kakao_account.email;
  } else {
    nickname = res.locals.naver.nickname;
    email = res.locals.naver.email;
  }

  models.User.findOrCreate({
    where: {
      [Op.or]: [{ nickname }, { email }],
    },
    defaults: {
      nickname,
      email,
    },
    raw: true,
  })
    .then(([user, created]) => {
      // delete user.email;
      // delete user.isPreferenceOrRateChecked;
      //delete user.isAdmin;
      if (created) {
        res.locals.user = user.dataValues;
      } else {
        res.locals.user = user;
      }
      next();
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

module.exports = signUp;
