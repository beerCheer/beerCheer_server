const should = require("should");
const request = require("supertest");
const app = require("../../index");
const models = require("../../models/index");
const userSeed = require("../../dummyForTest/user");
const rateSeed = require("../../dummyForTest/rates");
const commentSeed = require("../../dummyForTest/comment");
const favoriteSeed = require("../../dummyForTest/favorite");

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
    await models.Favorite.bulkCreate(favoriteSeed);
  });

  let accessToken;
  before("login", (done) => {
    request(app)
      .post("/kakao")
      .send({ nickname: userSeed[0].nickname, email: userSeed[0].email })
      .end((err, res) => {
        accessToken = res.headers["set-cookie"];
        done();
      });
  });

  describe("getBeersByNameHandler는 ", () => {
    describe("성공시", () => {
      it("검색한 맥주에 대한 별점 데이터가 없는 경우, avg 값이 존재하지 않는다", (done) => {
        request(app)
          .get("/beers/search?name=AB:12")
          .end((err, res) => {
            res.body.should.have.keys("totalResults", "result");
            res.body.result[0].should.not.have.keys("avg");
            done();
          });
      });
      it("검색한 맥주에 대한 별점 데이터가 있는 경우, avg 값을 포함해 응답한다", (done) => {
        request(app)
          .get("/beers/search?name=Buzz")
          .end((err, res) => {
            should.equal(res.body.result[0].avg, 3);
            done();
          });
      });
      it("유저 아이디가 있는 경우, 해당 유저가 맥주를 보관했는지 확인 후 favorite 값을 포함해 응답한다", (done) => {
        request(app)
          .get("/beers/search?name=Buzz&id=1")
          .end((err, res) => {
            res.body.result[0].favorite.should.be.true();
            done();
          });
      });
    });
  });

  describe("getBeerByBeerIdHandler는", () => {
    describe("성공시", () => {
      it("유저 아이디가 없는 경우, 맥주와 평균 별점만 응답한다", (done) => {
        request(app)
          .get("/beers/1")
          .end((err, res) => {
            res.body.beer.should.be.instanceOf(Object);
            should.equal(res.body.avg, 3);
            done();
          });
      });

      it("유저 아이디가 있는 경우, 맥주와 평균 별점, 그리고 보관 여부도 응답하며, 보관하는 맥주일 경우 favorite는 true이다", (done) => {
        request(app)
          .get("/beers/1?id=1")
          .end((err, res) => {
            res.body.beer.should.be.instanceOf(Object);
            should.equal(res.body.avg, 3);
            res.body.favorite.should.be.true();
            done();
          });
      });

      it("유저 아이디가 있는 경우, 맥주와 평균 별점, 그리고 보관 여부도 응답하며, 보관하지 않는 맥주일 경우 isLiked는 false이다", (done) => {
        request(app)
          .get("/beers/2?id=1")
          .end((err, res) => {
            res.body.beer.should.be.instanceOf(Object);
            should.equal(res.body.avg, 3);
            res.body.favorite.should.not.be.true();
            done();
          });
      });

      it("해당 맥주에 대한 별점이 아직 없는 경우 rate는 '별점없음'이다", (done) => {
        request(app)
          .get("/beers/123?id=1")
          .end((err, res) => {
            should.equal(res.body.avg, 0);
            done();
          });
      });
    });
  });

  describe("getAllBeersHandler는", () => {
    describe("성공시", () => {
      it("isPreferenceOrRateChecked가 true인 경우 맥주 객체 내에 avg 값을 포함한다", (done) => {
        request(app)
          .get("/beers?page=1&per_page=3&isPreferenceOrRateChecked=true")
          .end((err, res) => {
            res.body.should.have.keys(
              "page",
              "totalPages",
              "totalResults",
              "result"
            );
            res.body.result[0].should.have.keys("avg");
            done();
          });
      });
      it("isPreferenceOrRateChecked가 false인 경우 맥주 객체 내에 avg 값을 포함하지 않는다", (done) => {
        request(app)
          .get("/beers?page=1&per_page=3&isPreferenceOrRateChecked=false")
          .end((err, res) => {
            res.body[0].should.not.have.keys("avg");
            done();
          });
      });
      it("userId가 있는 경우 유저가 보관한 맥주인지 favorite: true를 포함한다", (done) => {
        request(app)
          .get("/beers?page=1&per_page=7&isPreferenceOrRateChecked=true&id=1")
          .end((err, res) => {
            res.body.result[6].should.have.keys("favorite");
            done();
          });
      });
      it("userId가 없는 경우 유저가 보관한 맥주인지 favorite를 포함하지 않는다", (done) => {
        request(app)
          .get("/beers?page=1&per_page=7&isPreferenceOrRateChecked=true")
          .end((err, res) => {
            res.body.result[6].should.not.have.keys("favorite");
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
      // it("isPreferenceOrRateChecked가 없는 경우 'isPreferenceOrRateChecked 없음'을 응답한다", (done) => {
      //   request(app)
      //     .get("/beers?page=1&per_page=3")
      //     .end((err, res) => {
      //       should.equal(res.body.message, "isPreferenceOrRateChecked 없음");
      //       done();
      //     });
      // });
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
      it("응답객체는 page, totalPages, totalResults,rows 키값을 갖는다.", (done) => {
        request(app)
          .get("/beers/1/comments?page=1&per_page=3")
          .end((err, res) => {
            res.body.should.have.keys(
              "page",
              "totalResults",
              "totalPages",
              "rows"
            );
            done();
          });
      });
      it("맥주 아이디에 대한 댓글이 있다면 page, totalPages, totalResults, rows 값을 갖는다.", (done) => {
        request(app)
          .get("/beers/1/comments?page=1&per_page=3")
          .end((err, res) => {
            res.body.should.have.keys(
              "page",
              "totalPages",
              "totalResults",
              "rows"
            );
            done();
          });
      });

      it("맥주 아이디에 대한 댓글이 없다면 page=1, totalPages=0, totalResults=0, rows=[]이다.", (done) => {
        request(app)
          .get("/beers/100/comments?page=1&per_page=3")
          .end((err, res) => {
            should.equal(res.body.page, 1);
            should.equal(res.body.totalPages, 0);
            should.equal(res.body.totalResults, 0);
            res.body.rows.should.be.empty();
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

  describe("favoriteBeerHandler는", () => {
    describe("성공시", () => {
      it("로그인한 유저가 특정 아이디의 맥주를 보관(하트)를 눌렀다면, 'isFavoriteBeer: true'를 반환한다", (done) => {
        request(app)
          .get("/beers/7/favorites")
          .set("Cookie", ["accessToken", accessToken])
          .end((err, res) => {
            res.body.isFavoriteBeer.should.be.true();
            done();
          });
      });
      it("로그인한 유저가 특정 아이디의 맥주를 보관(하트)를 누르지 않았다면, 'isFavoriteBeer: false'를 반환한다", (done) => {
        request(app)
          .get("/beers/100/favorites")
          .set("Cookie", ["accessToken", accessToken])
          .end((err, res) => {
            res.body.isFavoriteBeer.should.be.false();
            done();
          });
      });
    });
  });

  describe("ratedBeerHandler는", () => {
    describe("성공시", () => {
      it("로그인한 유저가 특정 아이디의 맥주를 평가했다면, rate를 응답한다", (done) => {
        request(app)
          .get("/beers/1/rates")
          .set("Cookie", ["accessToken", accessToken])
          .end((err, res) => {
            res.body.isBeerRated.should.be.true();
            res.body.should.have.property("avg", 1);
            done();
          });
      });

      it("로그인한 유저가 특정 아이디의 맥주를 평가했다면, rate를 응답한다", (done) => {
        request(app)
          .get("/beers/100/rates")
          .set("Cookie", ["accessToken", accessToken])
          .end((err, res) => {
            res.body.isBeerRated.should.be.false();
            done();
          });
      });
    });
  });
});
