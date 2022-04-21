const axios = require("axios");

const getAllBeearsByPage = async (page, per_page, next) => {
  try {
    const beers = await axios.get(
      `https://api.punkapi.com/v2/beers?page=${page}&per_page=${per_page}`
    );
    return new Promise((resolve, reject) => {
      if (err) {
        reject(err);
      }
      resolve(beers);
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const getTwelveBeersById = async (numArr, next) => {
  let punkUrl = "https://api.punkapi.com/v2/beers";

  punkUrl += "?ids=";
  for (const num of numArr) {
    punkUrl = punkUrl + num + "|";
  }
  punkUrl = punkUrl.slice(0, -1);

  try {
    const beers = await axios.get(punkUrl);
    return new Promise((resolve, reject) => {
      if (err) {
        reject("hello");
      }
      resolve(beers);
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = {
  getAllBeearsByPage,
  getTwelveBeersById,
};
