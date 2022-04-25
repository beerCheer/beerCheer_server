const should = require("should");
const request = require("supertest");
const app = require("../../index");
const models = require("../../models/index");
const userSeed = require("../../dummyForTest/user");
const preferenceSeed = require("../../dummyForTest/preferences");
const rateSeed = require("../../dummyForTest/rates");

describe("Set up DB", () => {
  beforeEach("Sync DB", (done) => {
    models.sequelize.sync({ force: true }).then(() => {
      done();
    });
  });

  beforeEach("Bulkinsert Data", async () => {
    await models.User.bulkCreate(userSeed);
    await models.Preference.bulkCreate(preferenceSeed);
    await models.Rate.bulkCreate(rateSeed);
  });

  let accessTokenForOnlyPreference;
  beforeEach("login", (done) => {
    request(app)
      .post("/oauth")
      .send({ nickname: userSeed[4].nickname, email: userSeed[4].email })
      .end((err, res) => {
        accessTokenForOnlyPreference = res.headers["set-cookie"];
        done();
      });
  });

  let accessTokenForOnlyRate;
  beforeEach("login", (done) => {
    request(app)
      .post("/oauth")
      .send({ nickname: userSeed[3].nickname, email: userSeed[3].email })
      .end((err, res) => {
        accessTokenForOnlyRate = res.headers["set-cookie"];
        done();
      });
  });

  let accessTokenForBoth;
  beforeEach("login", (done) => {
    request(app)
      .post("/oauth")
      .send({ nickname: userSeed[0].nickname, email: userSeed[0].email })
      .end((err, res) => {
        accessTokenForBoth = res.headers["set-cookie"];
        done();
      });
  });

  describe("recommendHandler는", () => {
    describe("성공시", () => {
      it("preference, rate를 모두 체크한 유저는 rate를 기반으로 추천한다", (done) => {
        request(app)
          .get("/recommendations")
          .set("Cookie", ["accessToken", accessTokenForBoth])
          .end((err, res) => {
            console.log(res.body);
            res.body.should.have.a.lengthOf(18);
            done();
          });
      });

      it("preference만 체크한 유저는 preference를 기반으로 추천한다", (done) => {
        request(app)
          .get("/recommendations")
          .set("Cookie", ["accessToken", accessTokenForOnlyPreference])
          .end((err, res) => {
            res.body.should.have.a.lengthOf(18);
            done();
          });
      });

      it("rate만 체크한 유저는 rate를 기반으로 추천한다", (done) => {
        request(app)
          .get("/recommendations")
          .set("Cookie", ["accessToken", accessTokenForOnlyRate])
          .end((err, res) => {
            res.body.should.have.a.lengthOf(20);
            done();
          });
      });
    });
  });
});
