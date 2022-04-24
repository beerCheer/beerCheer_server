const decodeAccessToken = require("../utils/decodeAccessToken");

const isLoggedIn = async (req, res, next) => {
  try {
    const { accessToken } = req.cookies;
    if (accessToken) {
      const decoded = await decodeAccessToken(accessToken);
      res.locals.id = decoded.id;
      next();
    } else {
      return res.status(401).json({
        message: "accessToken 없음",
      });
    }
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = isLoggedIn;
