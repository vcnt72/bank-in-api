const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const mutationRouter = require("./routes/mutationRoute");

app.use(bodyparser.json());
app.use(mutationRouter);

const port = 3001 || process.env.PORT;

app.listen(port, () => {
  console.log("Sign on " + port);
});
