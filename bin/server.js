const app = require("../index");
require("dotenv").config();

app.listen(3000, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
