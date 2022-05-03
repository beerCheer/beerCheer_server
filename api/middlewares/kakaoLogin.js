require("dotenv").config();
const request = require("request");

const kakaoLogin = async (req, res, next) => {
  const { code, redirectUri } = req.body;​
  const api_url = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${process.env.BEER_KAKAO_CLIENTID}&redirect_uri=${redirectUri}&code=${code}`;
  const options = {
    url: api_url,
    method: 'POST',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
  };

  request.post(options, function (error, response, body) {

    if (!error && response.statusCode == 200) {
      const { access_token } = JSON.parse(body);
      //console.log(access_token);

      const options = {
        url: "https://kapi.kakao.com//v2/user/me",
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      };

      request.get(options, function (error, response, body) {
        if (!error) {
          res.locals.kakao = JSON.parse(body);
          next();
        } else {
          res.status(response.statusCode).end();
          console.log("error = " + response.statusCode);
        }
      });
    } else {
      res.status(response.statusCode).end();
      console.log("error = " + response.statusCode);
    }
  });
};

module.exports = kakaoLogin;