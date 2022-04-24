const should = require("should");
const request = require("supertest");
const app = require("../../index");
const models = require("../../models/index");
const userSeed = require("../../dummyForTest/user");
const rateSeed = require("../../dummyForTest/rates");
const commentSeed = require("../../dummyForTest/comment");

describe("Set up DB", () => {
  beforeEach("sync DB", (done) => {
    models.sequelize.sync({ force: true }).then(() => {
      done();
    });
  });

  beforeEach("Bulkinsert Data", async () => {
    await models.User.bulkCreate(userSeed);
    await models.Rate.bulkCreate(rateSeed);
    await models.Comment.bulkCreate(commentSeed);
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

  describe("getAllCommentsByBeerId는", () => {
    describe("성공시", () => {
      it("응답객체는 count와 rows 키값을 갖는다.", (done) => {
        request(app)
          .get("/beers/1/comments?page=1&per_page=3")
          .end((err, res) => {
            res.body.should.have.keys("count", "rows");
            done();
          });
      });
      it("맥주 아이디에 대한 댓글이 있다면 count와 rows.length는 1 이상이다.", (done) => {
        request(app)
          .get("/beers/1/comments?page=1&per_page=3")
          .end((err, res) => {
            should.equal(res.body.count, 1);
            res.body.rows.should.have.a.lengthOf(1);
            done();
          });
      });
      it("맥주 아이디에 대한 댓글이 없다면 count와 rows.length는 0이다.", (done) => {
        request(app)
          .get("/beers/100/comments?page=1&per_page=3")
          .end((err, res) => {
            should.equal(res.body.count, 0);
            res.body.rows.should.be.empty;
            done();
          });
      });
    });
    describe("실패시", () => {
      it("beerId, page 또는 per_page가 없는 경우 400과 'beerId, page 또는 per_page 없음'을 응답한다", (done) => {
        request(app)
          .get("/beers/1/comments")
          .expect(400)
          .end((err, res) => {
            should.equal(res.body.message, "beerId, page 또는 per_page 없음");
            done();
          });
      });
    });
  });
});
