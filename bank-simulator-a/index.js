const express = require("express");
const bodyparser = require("body-parser");
const app = express();
const VirtualAccounts = require("./db/models").VirtualAccounts;
const Bank = require("./db/models").Company;

app.use(bodyparser.json());

app.post("/bank1/va/register", async (req, res) => {
  try {
    const { code, phoneNumber } = req.body;

    const company = await Company.findOne({
      where: {
        code
      }
    });

    if (!checkBank) {
      res.status(404).json({
        data: 404,
        message: "Not found",
        data: null
      });
    }

    const registerVA = await VirtualAccounts.findOrCreate({
      where: {
        phoneNumber
      },
      defaults: {
        phoneNumber
      }
    });

    await registerVA.addCompany(company);

    res.status(201).json({
      data: 201,
      message: "Success",
      data: null
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: null
    });
  }
});

app.listen(4000, () => {
  console.log("Up in port " + 4000);
});
