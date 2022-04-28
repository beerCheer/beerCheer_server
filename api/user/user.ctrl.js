const { Op } = require("sequelize");
const models = require("../../models/index");

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

module.exports = {
  logoutUser,
  nicknameValidationCheck,
  updateUserNickname,
  deleteUser,
  getUser,
};
