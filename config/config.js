require("dotenv").config();
const development = {
  username: process.env.DEV_DB_USERNAME,
  password: process.env.DEV_DB_PASSWORD,
  database: process.env.DEV_DB_NAME,
  host: "127.0.0.1",
  dialect: "mysql",
  logging: false,
  timezone: "+09:00",
};
const test = {
  username: process.env.TEST_DB_USERNAME,
  password: process.env.TEST_DB_PASSWORD,
  database: process.env.TEST_DB_NAME,
  host: "127.0.0.1",
  dialect: "mysql",
  logging: false,
  timezone: "Asia/Seoul",
};
const production = {
  username: process.env.PRODUCT_DB_USERNAME,
  password: process.env.PRODUCT_DB_PASSWORD,
  database: process.env.PRODUCT_DB_NAME,
  host: "127.0.0.1",
  dialect: "mysql",
  logging: false,
  timezone: "Asia/Seoul",
};

module.exports = {
  development,
  test,
  production,
};
