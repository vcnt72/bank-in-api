const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const transferRouter = require("./routes/transferRoutes");

const port = 3003 || process.env.PORT;
app.use(bodyParser.json());

app.use(transferRouter);

app.listen(port, () => {
  console.log("listened to " + port);
});
