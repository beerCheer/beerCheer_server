const should = require("should");
const request = require("supertest");
const app = require("../../index");
const models = require("../../models/index");
const userSeed = require("../../dummyForTest/user");

describe("Set up Database", () => {
  // const users = [
  //   {
  //     nickname: "test1",
  //     email: "test1@test.com",
  //   },
  //   {
  //     nickname: "test2",
  //     email: "test2@test.com",
  //   },
  //   {
  //     nickname: "test3",
  //     email: "test3@test.com",
  //   },
  // ];

  beforeEach("Sync DB", (done) => {
    models.sequelize.sync({ force: true }).then(() => {
      done();
    });
  });

  beforeEach("Bulkinsert Data", async () => {
    await models.User.bulkCreate(userSeed);
  });

  let accessToken;
  beforeEach("login", (done) => {
    request(app)
      .post("/oauth")
      .send({ nickname: userSeed[1].nickname, email: userSeed[1].email })
      .end((err, res) => {
        accessToken = res.headers["set-cookie"];
        done();
      });
  });

  describe("OauthHandler는", () => {
    describe("성공시", () => {
      it("쿠키에 액세스 토큰을 저장한다", (done) => {
        request(app)
          .post("/oauth")
          .send({ nickname: userSeed[1].nickname, email: userSeed[1].email })
          .end((err, res) => {
            res.headers["set-cookie"].should.have.lengthOf(1);
            done();
          });
      });
    });
  });

  describe("isLoggedIn는", () => {
    describe("실패시", () => {
      it("401과 'accessToken 없음'을 응답한다", (done) => {
        request(app)
          .post("/users/userInfo")
          .send({ nickname: userSeed[1].nickname })
          .expect(401)
          .end((err, res) => {
            should.equal(res.body.message, "accessToken 없음");
            done();
          });
      });
    });
  });

  describe("nicknameValidationCheck는", () => {
    describe("성공시", () => {
      it("닉네임이 사용중인 경우, '사용중인 닉네임'을 응답한다", (done) => {
        request(app)
          .post("/users/userInfo")
          .set("Cookie", ["accessToken", accessToken])
          .send({ nickname: userSeed[1].nickname })
          .end((err, res) => {
            should.equal(res.body.message, "사용중인 닉네임");
            done();
          });
      });
      it("닉네임이 사용중이지 않은 경우, '사용가능한 닉네임'을 응답한다", (done) => {
        request(app)
          .post("/users/userInfo")
          .set("Cookie", ["accessToken", accessToken])
          .send({ nickname: "nickname_to_update" })
          .end((err, res) => {
            should.equal(res.body.message, "사용가능한 닉네임");
            done();
          });
      });
    });

    describe("실패시", () => {
      it("닉네임을 전달받지 못한 경우, '닉네임 없음'을 응답한다", (done) => {
        request(app)
          .post("/users/userInfo")
          .set("Cookie", ["accessToken", accessToken])
          .end((err, res) => {
            should.equal(res.body.message, "닉네임 없음");
            done();
          });
      });
    });
  });

  describe("updateUserNickname는", () => {
    describe("성공시", () => {
      it("204를 응답한다", (done) => {
        request(app)
          .patch("/users/userInfo")
          .send({ nickname: "nickname_to_update" })
          .set("Cookie", ["accessToken", accessToken])
          .expect(204)
          .end(done);
      });
    });

    describe("실패시", () => {
      it("닉네임을 전달받지 못한 경우, '닉네임 없음'을 응답한다", (done) => {
        request(app)
          .patch("/users/userInfo")
          .set("Cookie", ["accessToken", accessToken])
          .end((err, res) => {
            should.equal(res.body.message, "닉네임 없음");
            done();
          });
      });
    });
  });

  describe("logoutUser는", () => {
    describe("성공시", () => {
      it("205를 응답한다", (done) => {
        request(app)
          .post("/users/logout")
          .set("Cookie", ["accessToken", accessToken])
          .expect(205)
          .end(done);
      });
    });
  });

  describe("deleteUser는", () => {
    describe("성공시", () => {
      it("204를 응답한다", (done) => {
        request(app)
          .delete("/users")
          .set("Cookie", ["accessToken", accessToken])
          .expect(204)
          .end(done);
      });
    });
  });
});
