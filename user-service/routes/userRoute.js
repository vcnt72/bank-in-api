const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../db/models").User;

router.post("/users", async (req, res) => {
  try {
    const user = await User.findOrCreate({
      where: {
        email: req.body.email
      },
      defaults: {
        password: req.body.password,
        status: req.body.status,
        phoneNumber: req.body.phoneNumber,
        fullName: req.body.fullName,
        role: req.body.role
      }
    });

    res.status(201).json({
      status: 201,
      message: "Success",
      data: user
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Internal server error",
      data: null
    });
  }
});

router.patch("/users/public/status", async (req, res) => {
  try {
    //find user by id for admin reasons
    const { id, status } = req.body;

    const user = await User.findByPk(id);

    // if status wasn't as expected
    if (
      status !== "rejected" &&
      status !== "activated" &&
      status !== "blocked"
    ) {
      return res.status(400).json({
        message: "Bad request",
        status: 400,
        data: null
      });
    }

    user.status = status;

    await user.save();

    res.status(200).json({
      message: "Success",
      status: 200,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      status: 500,
      data: null
    });
  }
});

router.get("/users", auth.isAdmin, async (req, res) => {
  try {
    //get all users
    const user = await User.findAll({});
    res.json({
      message: "Success",
      status: 200,
      data: user
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error,
      status: 500,
      data: null
    });
  }
});

router.post("/users/find", async (req, res) => {
  try {
    //Get user by phone number

    const input = req.body;

    const user = await User.findOne({
      where: {
        ...input
      }
    });

    //if user wasn't found
    if (!user)
      return res.status(208).json({
        message: "Not Found",
        status: 208,
        data: null
      });

    //return user id if user was found
    return res.status(200).json({
      message: "Success",
      status: 200,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      status: 500,
      data: null
    });
  }
});

router.post("/users/public/find", async (req, res) => {
  try {
    //Get user by phone number

    const input = req.body;

    const user = await User.findOne({
      where: {
        ...input
      }
    });

    //if user wasn't found
    if (!user)
      return res.status(208).json({
        message: "Not Found",
        status: 208,
        data: null
      });

    //return user id if user was found
    return res.status(200).json({
      message: "Success",
      status: 200,
      data: user
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
