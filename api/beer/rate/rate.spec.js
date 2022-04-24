const should = require("should");
const request = require("supertest");
const app = require("../../../index");
const models = require("../../../models");
const userSeed = require("../../../dummyForTest/user");
const rateSeed = require("../../../dummyForTest/rates");
const commentSeed = require("../../../dummyForTest/comment");

describe("Set up DB", () => {
  beforeEach("sync DB", (done) => {
    models.sequelize.sync({ force: true }).then(() => {
      done();
    });
  });

  beforeEach("Bulkinsert Data", async () => {
    await models.User.bulkCreate(userSeed);
    //await models.Rate.bulkCreate(rateSeed);
  });
  let accessToken;
  beforeEach("login", (done) => {
    request(app)
      .post("/oauth")
      .send({
        nickname: userSeed[0].nickname,
        email: userSeed[0].email,
      })
      .end((err, res) => {
        accessToken = res.headers["set-cookie"];
        done();
      });
  });

  describe("createRateHandler는", () => {
    const rate = 5;
    describe("성공시", () => {
      it("201을 응답한다", (done) => {
        request(app)
          .post("/beers/1/rates")
          .send({ rate })
          .set("Cookie", ["accessToken", accessToken])
          .expect(201)
          .end(done);
      });
    });

    describe("실패시", () => {
      it("beerId 또는 content가 없는 경우 400과 'beerId 또는 content 없음'을 응답한다", (done) => {
        request(app)
          .post("/beers/1/rates")
          .set("Cookie", ["accessToken", accessToken])
          .expect(400)
          .end((err, res) => {
            should.equal(res.body.message, "beerId 또는 rate 없음");
            done();
          });
      });
    });
  });

  describe("updateRateHandler는", () => {
    const rate = 1;
    describe("성공시", () => {
      it("204를 응답한다", (done) => {
        request(app)
          .patch("/beers/1/rates")
          .send({ rate })
          .set("Cookie", ["accessToken", accessToken])
          .expect(204)
          .end(done);
      });
    });

    describe("실패시", () => {
      it("beerId 또는 content가 없는 경우 400과 'beerId 또는 content 없음'을 응답한다", (done) => {
        request(app)
          .patch("/beers/1/rates")
          .set("Cookie", ["accessToken", accessToken])
          .expect(400)
          .end((err, res) => {
            should.equal(res.body.message, "beerId 또는 rate 없음");
            done();
          });
      });
    });
  });
});
