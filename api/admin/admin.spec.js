const should = require("should");
const request = require("supertest");
const app = require("../../index");
const models = require("../../models/index");
const userSeed = require("../../dummyForTest/user");
const commentSeed = require("../../dummyForTest/comment");

describe("Set up DB", () => {
  beforeEach("sync DB", (done) => {
    models.sequelize.sync({ force: true }).then(() => {
      done();
    });
  });

  beforeEach("Bulkinsert Data", async () => {
    await models.User.bulkCreate(userSeed);
    await models.Comment.bulkCreate(commentSeed);
  });

  let accessTokenForAdmin;
  beforeEach("login", (done) => {
    request(app)
      .post("/oauth")
      .send({
        nickname: userSeed[1].nickname,
        email: userSeed[1].email,
      })
      .end((err, res) => {
        accessTokenForAdmin = res.headers["set-cookie"];
        done();
      });
  });

  let accessTokenForUser;
  beforeEach("login", (done) => {
    request(app)
      .post("/oauth")
      .send({
        nickname: userSeed[0].nickname,
        email: userSeed[0].email,
      })
      .end((err, res) => {
        accessTokenForUser = res.headers["set-cookie"];
        done();
      });
  });

  describe("getAllUsersHandler는", () => {
    describe("성공시", () => {
      it("count와 rows를 응답한다", (done) => {
        request(app)
          .get("/admin/users?page=1&per_page=2")
          .set("Cookie", ["accessToken", accessTokenForAdmin])
          .end((err, res) => {
            res.body.should.have.keys("count", "rows");
            res.body.rows.should.have.a.lengthOf(2);
            done();
          });
      });
    });

    describe("실패시", () => {
      it("page 또는 per_page가 없는 경우, 400과 'page, per_page 없음'을 응답한다", (done) => {
        request(app)
          .get("/admin/users")
          .set("Cookie", ["accessToken", accessTokenForAdmin])
          .expect(400)
          .end((err, res) => {
            should.equal(res.body.message, "page, per_page 없음");
            done();
          });
      });

      it("isAdmin=true가 아닌 경우, 403을 응답한다", (done) => {
        request(app)
          .get("/admin/users?page=1&per_page=2")
          .set("Cookie", ["accessToken", accessTokenForUser])
          .expect(403)
          .end(done);
      });
    });
  });

  describe("getAllCommentsHandler는", () => {
    describe("성공시", () => {
      it("count와 rows를 응답한다", (done) => {
        request(app)
          .get("/admin/comments?page=1&per_page=2")
          .set("Cookie", ["accessToken", accessTokenForAdmin])
          .end((err, res) => {
            res.body.should.have.keys("count", "rows");
            res.body.rows.should.have.a.lengthOf(2);
            done();
          });
      });
    });
    describe("실패시", () => {
      it("page 또는 per_page가 없는 경우, 400과 'page, per_page 없음'을 응답한다", (done) => {
        request(app)
          .get("/admin/comments")
          .set("Cookie", ["accessToken", accessTokenForAdmin])
          .expect(400)
          .end((err, res) => {
            should.equal(res.body.message, "page, per_page 없음");
            done();
          });
      });

      it("isAdmin=true가 아닌 경우, 403을 응답한다", (done) => {
        request(app)
          .get("/admin/comments?page=1&per_page=2")
          .set("Cookie", ["accessToken", accessTokenForUser])
          .expect(403)
          .end(done);
      });
    });
  });
});
