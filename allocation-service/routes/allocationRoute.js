const express = require("express");
const router = express.Router();
const Allocation = require("../db/models").Allocation;
const isAuth = require("../middleware/auth");
const sequelize = require("../db/models").sequelize;
const mutationServices = require("../services/mutationServices");
const userServices = require("../services/userServices");

//get allocations and will create allocations for the users if being called for the firsttime
router.get("/allocations", isAuth, async (req, res) => {
  try {
    const auth = req.auth;

    const allocations = await Allocation.findAll({
      where: {
        user: auth.phoneNumber
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

router.post("/allocations/public/main", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await userServices.findUserByEmail(email);
    const createAllocation = await Allocation.create({
      amount: 0,
      name: "main",
      user: user.phoneNumber
    });
    res.status(200).json({
      status: 200,
      message: "success",
      data: createAllocation
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: null
    });
  }
});

//create new allocations
router.put("/allocations", isAuth, async (req, res) => {
  const { amount, name, category } = req.body;
  const auth = req.auth;

  try {
    //find user balance which has named main

    const userAllocation = await Allocation.findOne({
      user: auth.phoneNumber,
      name: "main"
    });

    //decrease by the amount request on main
    //will be negative, cuz it's assume the front end have checked the balance through another end point

    const transaction = await sequelize.transaction(async t => {
      await userAllocation.decrement(
        {
          balance: amount
        },
        { transaction: t }
      );

      const allocation = await Allocation.create(
        {
          user: auth.phoneNumber,
          name,
          category,
          balance: amount
        },
        {
          transaction: t
        }
      );
      return allocation;
    });

    res.status(201).json({
      message: "Success",
      status: 201,
      data: transaction
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
    const auth = req.auth;

    const { name, amount } = req.body;

    const allocation = await Allocation.findOne({
      where: {
        user: auth.phoneNumber,
        name
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

router.post("/allocations/transfer", isAuth, async (req, res) => {
  try {
    const { name, recipient, amount } = req.body;
    const user = req.auth;
    const token = req.token;

    const getUserAllocation = await Allocation.findOne({
      where: {
        user: user.phoneNumber,
        name
      }
    });

    const getRecipientMain = await Allocation.findOne({
      where: {
        user: recipient,
        name: "main"
      }
    });

    // eslint-disable-next-line no-unused-vars
    const transaction = await sequelize.transaction(async t => {
      const decreaseUserAllocationWithFee = await getUserAllocation.decrement(
        {
          balance: amount + 50
        },
        {
          transaction: t
        }
      );

      // eslint-disable-next-line no-unused-vars
      const increaseRecipientMainBalance = await getRecipientMain.increment(
        {
          balance: amount
        },
        {
          transaction: t
        }
      );

      return decreaseUserAllocationWithFee;
    });

    // eslint-disable-next-line no-unused-vars
    const mutation = await mutationServices.postMutation(
      {
        amount,
        recipient,
        code: "TRO"
      },
      token
    );

    res.status(200).json({
      status: 200,
      messages: "Success",
      data: null
    });
  } catch (error) {
    res.json({
      message: error,
      status: 500,
      data: null
    });
  }
});
module.exports = router;
