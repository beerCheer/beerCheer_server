require("dotenv").config();
const development = {
  username: process.env.DEV_DB_USERNAME,
  password: process.env.DEV_DB_PASSWORD,
  database: process.env.DEV_DB_NAME,
  host: process.env.DEV_DB_HOST,
  dialect: "mysql",
  logging: false,
  timezone: "+09:00",
};
const test = {
  username: process.env.TEST_DB_USERNAME,
  password: process.env.TEST_DB_PASSWORD,
  database: process.env.TEST_DB_NAME,
  host: process.env.TEST_DB_HOST,
  dialect: "mysql",
  logging: false,
  timezone: "+09:00",
  pool: {
    max: 100,
    min: 0,
    idle: 200000,
    acquire: 1000000,
  },
};
const production = {
  username: process.env.PRODUCT_DB_USERNAME,
  password: process.env.PRODUCT_DB_PASSWORD,
  database: process.env.PRODUCT_DB_NAME,
  host: process.env.PRODUCT_DB_NAME,
  dialect: "mysql",
  logging: false,
  timezone: "+09:00",
};

module.exports = {
  development,
  test,
  production,
};
