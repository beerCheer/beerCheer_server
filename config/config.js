require("dotenv").config();
const development = {
  username: process.env.DEV_DB_USERNAME,
  password: process.env.DEV_DB_PASSWORD,
  database: process.env.DEV_DB_NAME,
  host: "127.0.0.1",
  dialect: "mysql",
  logging: false,
};
const test = {
  username: process.env.TEST_DB_USERNAME,
  password: process.env.TEST_DB_PASSWORD,
  database: process.env.TEST_DB_NAME,
  host: "127.0.0.1",
  dialect: "mysql",
  logging: false,
};
const production = {
  username: process.env.PRODUCT_DB_USERNAME,
  password: process.env.PRODUCT_DB_PASSWORD,
  database: process.env.PRODUCT_DB_NAME,
  host: "127.0.0.1",
  dialect: "mysql",
  logging: false,
};

module.exports = {
  development,
  test,
  production,
};
