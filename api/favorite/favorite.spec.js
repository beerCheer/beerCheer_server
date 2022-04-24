const should = require("should");
const request = require("supertest");
const app = require("../../index");
const models = require("../../models/index");
const userSeed = require("../../dummyForTest/user");
const rateSeed = require("../../dummyForTest/rates");
const commentSeed = require("../../dummyForTest/comment");

describe("Set up DB", () => {
  beforeEach("Sync DB", (done) => {
    models.sequelize.sync({ force: true }).then(() => {
      done();
    });
  });
  beforeEach("Bulkinsert Data", async () => {
    await models.User.bulkCreate(userSeed);
    await models.Rate.bulkCreate(rateSeed);
    await models.Comment.bulkCreate(commentSeed);
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
  describe("createFavoriteHandler는", () => {
    describe("성공시", () => {
      it("201을 응답한다", (done) => {
        request(app)
          .post("/favorites")
          .set("Cookie", ["accessToken", accessToken])
          .send({ beerId: 50 })
          .expect(201)
          .end(done);
      });
    });
    describe("실패시", () => {
      it("beerId가 없는 경우, 400과 'beerId 없음'을 응답한다", (done) => {
        request(app)
          .post("/favorites")
          .set("Cookie", ["accessToken", accessToken])
          .expect(400)
          .end((err, res) => {
            should.equal(res.body.message, "beerId 없음");
            done();
          });
      });
    });
  });
});
