const express = require("express");
const router = express.Router();
const Allocation = require("../db/models").Allocation;
const isAuth = require("../middleware/auth");
const sequelize = require("../db/models").sequelize;

//get allocations and will create allocations for the users if being called for the firsttime
router.get("/allocations", isAuth, async (req, res) => {
  try {
    const decode = req.decode;

    const allocations = await Allocation.findAll({
      where: {
        user: decode.phoneNumber
      }
    });

    res.json({
      message: "success",
      status: 200,
      data: [allocations]
    });
  } catch (error) {
    res.json({
      message: error,
      status: 500,
      data: null
    });
  }
});

//create new allocations
router.put("/allocations", isAuth, async (req, res) => {
  try {
    const decode = req.decode;

    //find user balance which has named main

    const userAllocation = await Allocation.findOne({
      user: decode.phoneNumber,
      name: "main"
    });

    //decrease by the amount request on main
    //will be negative, cuz it's assume the front end have checked the balance through another end point

    await userAllocation.decrement({
      balance: req.body.amount
    });

    await Allocation.create({
      user: decode.phoneNumber,
      name: req.body.name,
      category: req.body.category,
      balance: req.body.amount
    });

    res.status(201).json({
      message: "Success",
      status: 201,
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

router.post("/allocations/check/balance", isAuth, async (req, res) => {
  try {
    const decode = req.decode;
    const { name, amount } = req.body;
    const allocation = await Allocation.findOne({
      where: {
        user: decode.phoneNumber,
        name: name
      }
    });

    if (allocation.balance - amount < 0) {
      return res.status(200).json({
        message: "Insufficient funds",
        status: 200,
        data: null
      });
    }

    res.json({
      message: "Success",
      status: 200,
      data: [req.body]
    });
  } catch (error) {
    res.json({
      message: error,
      status: 500,
      data: null
    });
  }
});

//decrease main balance of the authenticated users
//by authenticating users
router.patch("/allocations/balance/decrease", isAuth, async (req, res) => {
  try {
    const { name, amount } = req.body;
    const decode = req.decode;
    const allocation = await Allocation.findOne({
      where: {
        user: decode.phoneNumber,
        name
      }
    });

    if (allocation.balance - amount < 0) {
      return res.status(403).json({
        message: "Insufficient amount",
        status: 403,
        data: null
      });
    }

    const transaction = await sequelize.transaction(async t => {
      const decrementingBalance = await allocation.decrement(
        {
          balance: amount
        },
        { transaction: t }
      );
      return decrementingBalance;
    });

    res.status(202).json({
      message: "Success",
      status: 202,
      data: transaction
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      status: 500,
      data: null
    });
  }
});

//increase main balance of the phoneNumber
router.patch("/allocations/balance/increase", isAuth, async (req, res) => {
  try {
    const { phoneNumber, amount } = req.body;
    const allocation = await Allocation.findOne({
      where: {
        user: phoneNumber,
        name: "main"
      }
    });

    const transaction = await sequelize.transaction(async t => {
      const incrementingBalance = await allocation.increment(
        {
          balance: amount
        },
        { transaction: t }
      );
      return incrementingBalance;
    });

    res.status(202).json({
      message: "Success",
      status: 202,
      data: transaction
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
