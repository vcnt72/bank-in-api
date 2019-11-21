const express = require("express");
const router = express.Router();
const axios = require("axios").default;
const isAuth = require("../middleware/auth");

router.post("/transfer", isAuth, async (req, res) => {
  try {
    const { amount, recipient, allocation } = req.body;
    const token = req.token;
    //decrease the user logged in balance
    const decreaseYourBalance = await axios.patch(
      "http://localhost:3002/allocations/balance/decrease",
      {
        amount,
        name: allocation
      },
      {
        header: "Bearer " + token
      }
    );

    const increaseRecipientBalance = await axios.patch(
      "http://localhost:3002/allocations/balance/increase",
      {
        phoneNumber: recipient,
        amount
      }
    );

    res.status(202).json({
      message: "Success",
      status: 202,
      data: null
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      status: 500,
      data: null
    });
  }
});

module.exports = router;
