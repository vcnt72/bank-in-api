const express = require("express");
const router = express.Router();
const userServices = require("../services/userServices");
const otpServices = require("../services/otpServices");
const auth = require("../middleware/auth");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../db/models").User;

router.get("/", (req, res) => {
  res.json({
    message: "Running"
  });
});

router.post("/users/register/otp", async (req, res) => {
  try {
    const user = req.body;

    //generating otp for user who is registering
    const otp = otpServices.generateOTP();

    //send email for register otp code
    userServices.sendEmail(user.email, "OTP code : " + otp);

    res.status(200).json({
      status: 200,
      message: "success",
      data: [{ user, otp }]
      //The otp variable are being send for faster testing only
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/users/register", async (req, res) => {
  try {
    const user = req.body.user;

    const otp = req.body.otp;

    //verifying otp
    const isValid = otpServices.verifyOTP(otp);

    if (isValid) {
      //Check if  the user is being rejected by admin
      const isRejected = await userServices.checkRejectedStatus(user);

      if (isRejected) {
        const rejectedUser = await User.findOne({
          where: {
            email: user.email
          }
        });

        rejectedUser.status = "activated";

        await rejectedUser.save();

        userServices.sendEmail(user.email, "activated");

        return res.status(201).json({
          message: "success",
          status: 201,
          data: [{ user: rejectedUser }]
        });
      }

      //else create new user

      const newUser = await User.create(user);

      res.status(201).json({
        message: "success",
        status: 201,
        data: newUser
      });
    } else {
      res.status(400).json({
        message: "Not valid",
        status: 400,
        data: null
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error,
      status: 500,
      data: null
    });
  }
});

router.post("/users/login/otp", async (req, res) => {
  // 80% counter haven't being applied for login

  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: {
        email
      }
    });

    if (!user || user.status !== "activated") {
      throw new Error("Credentials doesn't valid");
    }

    // see if input password same as it hash
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      throw new Error("Credentials doesn't valid");
    }

    //generating otp
    const otp = otpServices.generateOTP();

    //send otp
    userServices.sendEmail(user.email, "OTP : " + otp);

    res.status(200).json({
      message: "success",
      status: 200,
      data: [{ email: user.email, otp }]
    });
  } catch (error) {
    res.status(404).json({
      message: "Not found",
      status: 404,
      data: null
    });
  }
});

router.post("/users/login", async (req, res) => {
  try {
    //verify the otp which is inputted
    const isVerified = otpServices.verifyOTP(req.body.otp);

    console.log(isVerified);
    if (!isVerified) {
      throw new Error("Invalid OTP");
    }

    // get user by email

    const user = await User.findOne({
      where: { email: req.body.email }
    });

    //generate according to the user

    const token = await user.generateAuthToken();

    // console.log(token);

    res.json({
      message: "success",
      status: 200,
      data: [{ user, token }]
    });
  } catch (error) {
    res.status(404).json({
      message: "OTP Invalid",
      status: 404,
      data: null
    });
  }
});

router.post("/users/logout", auth.isAuth, async (req, res) => {
  try {
    //delete token in the user collections
    const user = req.user;
    user.token = "";
    await user.save();

    res.status(200).json({
      message: "success",
      status: 200,
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

router.patch("/users/:id/status", auth.isAdmin, async (req, res) => {
  try {
    //find user by id for admin reasons
    const user = await User.findById(req.params.id);
    const status = req.body.status;

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

    await user.updateOne({
      status
    });

    userServices.sendEmail(user.email, status);

    res.status(200).json({
      message: "Success update",
      status: 200,
      data: null
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      status: 500,
      data: null
    });
    error;
  }
});

router.post("/auth", async (req, res) => {
  const token = req.body.token;

  try {
    const decoded = jwt.verify(token, "secret");

    const user = await User.findOne({
      where: { phoneNumber: decoded.phoneNumber, token }
    });

    if (!user) {
      return res.status(404).json({
        message: "Not found",
        status: 404,
        data: null
      });
    }

    res.status(200).json({
      message: "Success",
      status: 200,
      data: [{ decoded, token }]
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

router.post("/users/phoneNumber", async (req, res) => {
  try {
    //Get user by phone number
    const user = await User.findOne({
      where: { phoneNumber: req.body.phoneNumber }
    });

    //if user wasn't found
    if (!user) {
      return res.status(404).json({
        message: "Not Found",
        status: 404,
        data: null
      });
    }

    //return user id if user was found
    return res.status(200).json({
      message: "Success",
      status: 200,
      data: [{ id: user.id }]
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
