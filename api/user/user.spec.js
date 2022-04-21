const should = require("should");
const express = require("express");
const cookieParser = require("cookie-parser");
const request = require("supertest");
const app = require("../../index");
const models = require("../../models/index");

const signUp = require("./user.ctrl");

describe("Set up Database", () => {
  const users = [
    {
      nickname: "test1",
      email: "test1@test.com",
    },
    {
      nickname: "test2",
      email: "test2@test.com",
    },
    {
      nickname: "test3",
      email: "test3@test.com",
    },
  ];

  const user = {
    nickname: "test4",
    email: "test4@test.com",
  };

  beforeEach("Sync DB", (done) => {
    models.sequelize.sync({ force: true }).then(() => {
      done();
    });
  });

  beforeEach("Bulkinsert Data", async () => {
    await models.User.bulkCreate(users);
  });

  describe("OauthHandler는", () => {
    describe("성공시", () => {
      it("쿠키에 액세스 토큰을 저장한다", (done) => {
        request(app)
          .post("/oauth")
          .send({ nickname: users[0].nickname, email: users[0].email })
          .end((err, res) => {
            res.res.headers["set-cookie"].should.have.lengthOf(1);
            done();
          });
      });
    });
    //describe("실패시", () => {});
  });
});
