const decodeAccessToken = require("../utils/decodeAccessToken");

const isAmdin = async (req, res, next) => {
  try {
    const { query: accessToken } = req.query;

    if (accessToken) {
      const decoded = await decodeAccessToken(accessToken);

      res.locals.id = decoded.id;
      res.locals.isAdmin = decoded.isAdmin;
      const userData = res.locals.isAdmin

      return res.json(userData)

    } else {
      return res.status(401).json({
        message: "accessToken 없음",
      });
    }
  } catch (err) {
    throw err
  }
};

module.exports = isAmdin;