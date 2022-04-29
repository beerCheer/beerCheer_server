const axios = require("axios");

const getAllBeearsByPage = async (page, per_page, next) => {
  try {
    const beers = await axios.get(
      `https://api.punkapi.com/v2/beers?page=${page}&per_page=${per_page}`
    );
    return new Promise((resolve) => {
      resolve(beers.data);
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
    return new Promise((resolve) => {
      resolve(beers.data);
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const getBeerById = async (beerId, next) => {
  let punkUrl = `https://api.punkapi.com/v2/beers/${beerId}`;
  try {
    const beer = await axios.get(punkUrl);
    return new Promise((resolve) => {
      resolve(beer.data);
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const getBeersByMalt = async (malt, next) => {
  malt = malt.replace(" ", "_");
  let punkUrl = `https://api.punkapi.com/v2/beers?malt=${malt}`;
  console.log(punkUrl);
  try {
    const beers = await axios.get(punkUrl);
    return new Promise((resolve) => {
      resolve(beers.data);
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const getBeersByName = async (name, next) => {
  name = name.replace(" ", "_");
  let punkUrl = `https://api.punkapi.com/v2/beers?beer_name=${name}`;
  try {
    const beers = await axios.get(punkUrl);
    return new Promise((resolve) => {
      resolve(beers.data);
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

module.exports = {
  getAllBeearsByPage,
  getTwelveBeersById,
  getBeerById,
  getBeersByMalt,
  getBeersByName,
};
