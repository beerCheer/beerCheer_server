const app = require("../index");
const syncDB = require("./db-sync");
require("dotenv").config();

syncDB().then(() => {
  console.log("Sync Database!");
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});
