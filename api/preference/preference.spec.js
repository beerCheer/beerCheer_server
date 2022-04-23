const should = require("should");
const request = require("supertest");
const app = require("../../index");
const models = require("../../models/index");
const userSeed = require("../../dummyForTest/user");

describe("Set up DB", () => {
  beforeEach("sync DB", (done) => {
    models.sequelize.sync({ force: true }).then(() => {
      done();
    });
  });

  beforeEach("Bulkinsert Data", async () => {
    await models.User.bulkCreate(userSeed);
  });

  describe("preferenceHandler는", () => {
    let accessToken;
    const beerId = 9;
    const malt = "Munich";
    const quantity = 5.63;
    beforeEach("login", (done) => {
      request(app)
        .post("/oauth")
        .send({ nickname: "test5", email: "test5@test.com" })
        .end((err, res) => {
          accessToken = res.headers["set-cookie"];
          done();
        });
    });
    describe("성공시", () => {
      it("201과 'isPreferenceOrRateChecked: true'를 응답한다", (done) => {
        request(app)
          .post("/preferences")
          .set("Cookie", ["accessToken", accessToken])
          .send({ beerId, malt, quantity })
          .expect(201)
          .end((err, res) => {
            res.body.isPreferenceOrRateChecked.should.be.true();
            done();
          });
      });
    });

    describe("실패시", () => {
      it("beerId, malt, 또는 quantity가 없는 경우, 400과 'beerId, malt 또는 quantity 없음'을 응답한다", (done) => {
        request(app)
          .post("/preferences")
          .set("Cookie", ["accessToken", accessToken])
          .expect(400)
          .end((err, res) => {
            should.equal(res.body.message, "beerId, malt 또는 quantity 없음");
            done();
          });
      });
    });
  });
});
