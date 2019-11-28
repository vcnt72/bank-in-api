const express = require("express");
const app = express();
const authRoute = require("./routes/authRoute");
const bodyparser = require("body-parser");

app.use(bodyparser.json());
app.use(authRoute);

const port = 3000 || process.env.PORT;

app.listen(port, () => {
  console.log("I'm in port " + port);
});
