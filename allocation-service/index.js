const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const allocationRouter = require("./routes/allocationRoute");

app.use(bodyparser.json());
app.use(allocationRouter);

const port = 3002 || process.env.PORT;

app.listen(port, () => {
  console.log("Sign on " + port);
});
