const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const userRouter = require("./routes/userRoute");

const port = 3001 || process.env.PORT;
app.use(bodyParser.json());

app.use(userRouter);

app.listen(port, () => {
  console.log("listened to " + port);
});
