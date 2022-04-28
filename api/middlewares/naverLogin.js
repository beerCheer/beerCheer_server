require("dotenv").config();
const naverLogin = async (req, res, next) => {
  const { state, code, redirectUri } = req.body;
  const api_url = `https://nid.naver.com/oauth2.0/token?grant_type=authorization_code&client_id=${process.env.BEER.NAVER_CLIENTID}&client_secret=${process.env.BEER_NAVER_CLIENT_SECRET}&redirect_uri=${redirectUri}&code=${code}&state=${state}`;
  const request = require("request");
  const options = {
    url: api_url,
    headers: {
      "X-Naver-Client-Id": process.env.BEER_NAVER_CLIENTID,
      "X-Naver-Client-Secret": process.env.BEER_NAVER_CLIENT_SECRET,
    },
  };
  request.get(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      const { access_token } = body;
      const options = {
        url: "https://openapi.naver.com/v1/nid/me",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      };
      request.get(options, function (error, response) {
        if (!error) {
          console.log(response);
          res.locals.naver = response;
          next();
        } else {
          res.status(response.statusCode).end();
          console.log("error = " + response.statusCode);
        }
      });
      next();
    } else {
      res.status(response.statusCode).end();
      console.log("error = " + response.statusCode);
    }
  });
};

module.exports = naverLogin;
