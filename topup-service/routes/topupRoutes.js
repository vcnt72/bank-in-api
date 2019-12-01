const express = require("express");
const router = express.Router();
const axios = require("axios").default;
const isAuth = require("../middleware/auth");
const Bank = require("../db/models").Bank;

router.get("/topup/va", isAuth, async (req, res) => {
  try {
    const auth = req.auth;
    const bankQuery = req.query.name;
    const bankDetails = await Bank.findOne({
      where: {
        name: bankQuery
      }
    });

    const va = bankDetails.code + auth;
    const checkRegisteredVA = await axios.post(bankDetails.callbackURI, {
      phoneNumber: auth.phoneNumber,
      code: bankDetails.code
    });

    res.status(200).json({
      status: 200,
      message: "Success",
      data: {
        va
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: null
    });
  }
});
