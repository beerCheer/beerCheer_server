const createAccessToken = require("../utils/createAccessToken");

const OAuthHandler = async (req, res, next) => {
  try {
    const accessToken = createAccessToken(res.locals.user);
    return res
      .cookie("accessToken", accessToken, {
        // maxAge: 9 * 60 * 60 * 1000 + 1000 * 60 * 60,
        httpOnly: true,
        //secure: true,
        sameSite: "none",
      })
      .end();
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = OAuthHandler;
