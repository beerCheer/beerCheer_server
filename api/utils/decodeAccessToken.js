const jwt = require("jsonwebtoken");

const decodeAccessToken = (accessToken) => {
  return new Promise((resolve, reject) => {
    jwt.verify(accessToken, process.env.ACCESS_SECRET, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

module.exports = decodeAccessToken;
