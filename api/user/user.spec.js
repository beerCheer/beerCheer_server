const should = require("should");
const request = require("supertest");
const app = require("../../index");
const models = require("../../models/index");
const userSeed = require("../../dummyForTest/user");

describe("Set up Database", () => {
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
      .post("/kakao")
      .send({ nickname: userSeed[0].nickname, email: userSeed[0].email })
      .end((err, res) => {
        accessToken = res.headers["set-cookie"];
        done();
      });
  });

  describe("getUser는", () => {
    describe("성공시", () => {
      it("유저 정보를 담은 객체를 응답한다", (done) => {
        request(app)
          .get("/users/1")
          .set("Cookie", ["accessToken", accessToken])
          .end((err, res) => {
            res.body.should.have.keys(
              "id",
              "nickname",
              "email",
              "isPreferenceOrRateChecked",
              "isAdmin"
            );
            done();
          });
      });
    });
    describe("실패시", () => {
      it("로그인한 유저와 요청하는 유저의 아이디가 다를 경우, 403을 응답한다", (done) => {
        request(app)
          .get("/users/1000")
          .set("Cookie", ["accessToken", accessToken])
          .expect(403)
          .end(done);
      });
    });
  });

  // describe("OauthHandler는", () => {
  //   describe("성공시", () => {
  //     it("쿠키에 액세스 토큰을 저장한다", (done) => {
  //       request(app)
  //         .post("/oauth")
  //         .send({ nickname: userSeed[0].nickname, email: userSeed[0].email })
  //         .end((err, res) => {
  //           res.headers["set-cookie"].should.have.lengthOf(1);
  //           done();
  //         });
  //     });
  //   });
  // });

  describe("isLoggedIn는", () => {
    describe("실패시", () => {
      it("401과 'accessToken 없음'을 응답한다", (done) => {
        request(app)
          .post("/users/userInfo")
          .send({ nickname: userSeed[0].nickname })
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
          .send({ nickname: userSeed[0].nickname })
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
    let accessTokenForAdmin;
    beforeEach("login", (done) => {
      request(app)
        .post("/kakao")
        .send({ nickname: userSeed[1].nickname, email: userSeed[1].email })
        .end((err, res) => {
          accessTokenForAdmin = res.headers["set-cookie"];
          done();
        });
    });
    describe("성공시", () => {
      it("204를 응답한다", (done) => {
        request(app)
          .delete("/users")
          .set("Cookie", ["accessToken", accessToken])
          .expect(204)
          .end(done);
      });

      it("isAdmin=true인 경우 200과 '유저4 강제탈퇴' 응답한다", (done) => {
        request(app)
          .delete("/users?id=4")
          .set("Cookie", ["accessToken", accessTokenForAdmin])
          .end((err, res) => {
            should.equal(res.body.message, "유저4 강제탈퇴");
            done();
          });
      });
    });

    describe("실패시", () => {
      it("isAdmin=true이지만, req.query.id가 없는 경우 400과 'id 없음'을 응답한다", (done) => {
        request(app)
          .delete("/users")
          .set("Cookie", ["accessToken", accessTokenForAdmin])
          .expect(400)
          .end((err, res) => {
            should.equal(res.body.message, "id 없음");
            done();
          });
      });
    });
  });
});
