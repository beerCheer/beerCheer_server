const jwt = require("jsonwebtoken");

const createAccessToken = (userData) => {
  const accessToken = jwt.sign(userData, process.env.ACCESS_SECRET);
  return accessToken;
};

module.exports = createAccessToken;
