const express = require("express");
const router = express.Router();
const Mutation = require("../db/models").Mutation;
const auth = require("../middleware/auth");
const axios = require("axios").default;
const utils = require("../utils/mutationUtils");

router.get("/mutations", auth, async (req, res) => {
  try {
    // Get all mutations
    const email = req.decode.user;
    const decoded = await axios.post("http://localhost:3001/users/find", {
      email
    });

    const mutations = await Mutation.findAll({
      where: { user: decoded.data.data.id }
    });

    res.status(200).json({
      message: "Success",
      status: 200,
      data: [mutations]
    });
  } catch (error) {
    res.status(500).json({
      message: error,
      status: 500,
      data: null
    });
  }
});

router.post("/mutations", auth, async (req, res) => {
  try {
    const input = req.body;
    const decode = req.decode;

    //temp code for if clause
    const code = input.code;

    //amount which recipient get
    const recipientAmount = utils.amountFormatter(
      "TRI",
      input.amount.toString()
    );

    //Set the amount to string for type save
    input.amount = utils.amountFormatter(input.code, input.amount);
    input.user = decode.id;
    input.code = input.code + (await utils.codeFormatter(decode.id));

    const mutation = await Mutation.create(input);
    input;

    if (code === "TRO") {
      // if the input code is TRO the transfer fee will be saved to mutation
      await Mutation.create({
        code: "TRF" + (await utils.codeFormatter(decode.id)),
        recipient: "Bank-in",
        amount: utils.amountFormatter("TRF", "50"),
        user: decode.id
      });

      //Requesting the recipient id from user service
      const requestRecipientID = await axios.post(
        "http://localhost:3001/users/find",
        {
          phoneNumber: input.recipient
        }
      );

      //get recipient id
      const recipientId = requestRecipientID.data.data.id;

      //Add transfer in mutation to corresponding recipient
      await Mutation.create({
        code: "TRI" + (await utils.codeFormatter(recipientId)),
        recipient: input.recipient,
        amount: recipientAmount,
        user: recipientId
      });
    }

    res.status(201).json({
      message: "Success",
      status: 201,
      data: [
        {
          mutation
        }
      ]
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
