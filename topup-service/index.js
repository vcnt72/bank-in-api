const bodyparser = require("body-parser");
const express = require("express");
const app = express();

app.use(bodyparser.json());

const port = 3004 || process.env.PORT;

app.listen(port, () => {
  console.log(port + " run");
});
