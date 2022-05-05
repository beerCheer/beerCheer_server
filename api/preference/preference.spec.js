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
    const beers = [
      {
        beerId: 1,
        malt: "munich",
        quantity: 7,
      },
      {
        beerId: 2,
        malt: "munich",
        quantity: 3.5,
      },
      {
        beerId: 8,
        malt: "munich",
        quantity: 3.8,
      },
    ];

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
          .send(beers)
          .expect(201)
          .end((err, res) => {
            res.body.isPreferenceOrRateChecked.should.be.true();
            done();
          });
      });
    });

    describe("실패시", () => {
      it("beers가 없는 경우, 400과 'beers 없음'을 응답한다", (done) => {
        request(app)
          .post("/preferences")
          .set("Cookie", ["accessToken", accessToken])
          .expect(400)
          .end((err, res) => {
            should.equal(res.body.message, "beers 없음");
            done();
          });
      });
    });
  });
});
