const { Op } = require("sequelize");
const models = require("../../models/index");

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
};
