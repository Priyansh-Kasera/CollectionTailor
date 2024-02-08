const app = require("./app");
const dotenv = require("dotenv");
const path = require("path");
console.log("one two");
const connectDatabase = require("./config/databaseConnection");
//config
dotenv.config({ path: `${__dirname}/config/config.env` });
console.log("logging from here");
connectDatabase();

app.listen(process.env.PORT, () => {
  console.log(`sever running on port ${process.env.PORT}`);
});
