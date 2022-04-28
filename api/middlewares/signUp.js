const { Op } = require("sequelize");
const models = require("../../models/index");

const signUp = async (req, res, next) => {
  console.log(res.locals.naver, "signup");
  const { nickname, email } = res.locals.naver;
  //const { nickname, email } = req.body;
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
      res.locals.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

module.exports = signUp;
