const should = require("should");
const request = require("supertest");
const app = require("../../index");
const models = require("../../models/index");
const userSeed = require("../../dummyForTest/user");
const rateSeed = require("../../dummyForTest/rates");

describe("Set up DB", () => {
  beforeEach("sync DB", (done) => {
    models.sequelize.sync({ force: true }).then(() => {
      done();
    });
  });

  beforeEach("Bulkinsert Data", async () => {
    await models.User.bulkCreate(userSeed);
    await models.Rate.bulkCreate(rateSeed);
  });

  describe("getAllBeersHandler는", () => {
    describe("성공시", () => {
      it("isPreferenceOrRateChecked가 true인 경우 맥주 객체 내에 avg 값을 포함한다", (done) => {
        request(app)
          .get("/beers?page=1&per_page=3&isPreferenceOrRateChecked=true")
          .end((err, res) => {
            res.body[0].should.have.keys("avg");
            done();
          });
      });
      it("isPreferenceOrRateChecked가 false인 경우 맥주 객체 내에 avg 값을 포함하지 않는다", (done) => {
        request(app)
          .get("/beers?page=1&per_page=3&isPreferenceOrRateChecked=false")
          .end((err, res) => {
            res.body.should.not.have.keys("avg");
            done();
          });
      });
    });
    describe("실패시", () => {
      it("page 또는 per_page가 없는 경우 'page, per_page 없음'을 응답한다", (done) => {
        request(app)
          .get("/beers")
          .end((err, res) => {
            should.equal(res.body.message, "page, per_page 없음");
            done();
          });
      });
      it("isPreferenceOrRateChecked가 없는 경우 'isPreferenceOrRateChecked 없음'을 응답한다", (done) => {
        request(app)
          .get("/beers?page=1&per_page=3")
          .end((err, res) => {
            should.equal(res.body.message, "isPreferenceOrRateChecked 없음");
            done();
          });
      });
    });
  });

  describe("getTop12Handler는", () => {
    describe("성공시", () => {
      it("맥주 객체 내에 avg 값을 포함한다", (done) => {
        request(app)
          .get("/beers/rates")
          .end((err, res) => {
            res.body[0].should.have.keys("avg");
            done();
          });
      });
    });
  });
});
