const express = require("express");
const router = express.Router();
const axios = require("axios").default;
const isAuth = require("../middleware/auth");

router.get("/", (req, res) => {
  res.json({
    message: "Running"
  });
});

router.patch("/transfer", isAuth, async (req, res) => {
  try {
    const { amount, recipient, allocationName } = req.body;
    const token = req.token;
    //decrease the user logged in balance
    const decreaseYourBalance = await axios.patch(
      "http://localhost:3002/allocations/balance/decrease",
      {
        amount: amount + 50,
        name: allocationName
      },
      {
        headers: {
          Authorization: "Bearer " + token
        }
      }
    );

    const increaseRecipientBalance = await axios.patch(
      "http://localhost:3002/allocations/balance/increase",
      {
        phoneNumber: recipient,
        amount
      },
      {
        headers: {
          Authorization: "Bearer " + token
        }
      }
    );

    const insertMutation = await axios.post(
      "http://localhost:3001/mutations",
      {
        code: "TRO",
        recipient,
        amount
      },
      {
        headers: {
          Authorization: "Bearer " + token
        }
      }
    );

    res.status(202).json({
      message: "Success",
      status: 202,
      data: null
    });
  } catch (error) {
    res.status(500).json({
      message: error,
      status: 500,
      data: null
    });
  }
});

module.exports = router;
