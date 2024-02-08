const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const errorMiddleware = require("./middleware/error");
const path = require("path");
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);
const billRoute = require("./Routes/billRoutes");
const userRoute = require("./Routes/userRoutes");
const partyRoute = require("./Routes/partyRoutes");
app.use("/api", userRoute);
app.use("/api/bill", billRoute);
app.use("/api/party", partyRoute);

app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

app.use(errorMiddleware);
module.exports = app;
