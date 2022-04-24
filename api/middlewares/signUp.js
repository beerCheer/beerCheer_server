const { Op } = require("sequelize");
const models = require("../../models/index");

const signUp = async (req, res, next) => {
  const { nickname, email } = req.body;
  models.User.findOrCreate({
    where: {
      [Op.or]: [{ nickname }, { email }],
    },
    defaults: {
      nickname,
      email,
    },
  })
    .then(([user, created]) => {
      delete user.dataValues.email;
      delete user.dataValues.isPreferenceOrRateChecked;
      delete user.dataValues.isAdmin;
      res.locals.user = user.dataValues;
      next();
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};

module.exports = signUp;
