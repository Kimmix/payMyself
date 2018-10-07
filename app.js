const express = require("express");
const logger = require("morgan");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const app = express();

dotenv.config();
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Route path
app.use("/api/v1/admin", require("./server/routes/admin"));
app.use("/api/v1/auth", require("./server/routes/auth"));
app.use("/api/v1/user", require("./server/routes/user"));
app.use("/api/v1/product", require("./server/routes/product"));
app.use("/api/v1/cart", require("./server/routes/cart"));
app.get("/", (req, res) => 
  res.status(200).send({
    message:
      "Nobody exists on purpose. Nobody belong anywhere. We are all going to die."
  })
);

const port = parseInt(process.env.PORT, 10) || 7000;
app.listen(port, () => console.log(`Running on localhost:${port}`));
module.exports = app;
