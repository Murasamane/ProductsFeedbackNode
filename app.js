const express = require("express");
// const morgan = require("morgan");
// const bodyParser = require("body-parser");
// const cors = require("cors");
const feedbackRouter = require("./routes/feedbacksRouter");

const app = express();

// if (process.env.NODE_ENV === "development") {
//   app.use(morgan("dev"));
// }
app.use(express.json());
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
app.use("/api/v1/products", feedbackRouter);
module.exports = app;
