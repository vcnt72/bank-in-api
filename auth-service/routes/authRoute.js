const express = require("express");
const router = express.Router();
const userServices = require("../services/userServices");
const otpServices = require("../services/otpServices");
const mailServices = require("../services/mailServices");
const Auth = require("../db/models").Auth;
const jwt = require("jsonwebtoken");

router.post("/auth", async (req, res) => {
  try {
    const token = req.body.token;
    const userAuth = await Auth.findOne({
      where: {
        token
      }
    });

    if (!userAuth) {
      return res.status(404).json({
        status: 404,
        message: "Not found",
        data: null
      });
    }

    res.status(200).json({
      status: 200,
      message: "Success",
      data: {
        user: userAuth
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

// router.post("/auth", (req, res) => {});

router.post("/auth/logout", async (req, res) => {
  try {
    const user = req.body.email;
    const findSession = await Auth.findOne({
      where: {
        user
      }
    });

    if (!findSession) {
      return res.status(404).json({
        status: 404,
        message: "Not found",
        data: null
      });
    }

    await findSession.destroy();

    res.status(202).json({
      status: 202,
      message: "success",
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

router.post("/auth/login", async (req, res) => {
  try {
    const { isCredentials, user } = await userServices.findUserCredentials(
      req.body
    );

    if (!isCredentials) {
      res.status(401).json({
        status: 401,
        message: "Not authorized",
        data: null
      });
    }

    const otp = otpServices.generateOTP();

    await mailServices.sendEmail(user.email, otp);

    res.json({
      status: 200,
      message: "Success",
      data: user
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error,
      data: null
    });
  }
});

router.post("/auth/otp/login", async (req, res) => {
  try {
    const { otp, email } = req.body;

    const isOTPVerified = otpServices.verifyOTP(otp);

    if (!isOTPVerified)
      return res.status(401).json({
        message: "OTP isn't verified",
        status: 401,
        data: null
      });

    const getSession = await Auth.findOne({
      where: {
        user: email
      }
    });

    const token = jwt.sign(
      {
        email
      },
      "secret"
    );

    if (!getSession) {
      await Auth.create({
        user: email,
        token
      });

      return res.status(201).json({
        message: "Success",
        status: 201,
        data: {
          token
        }
      });
    }

    getSession.token = token;

    await getSession.save();

    res.status(200).json({
      message: "Success",
      status: 200,
      data: {
        token
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

router.post("/auth/register", async (req, res) => {
  try {
    const user = await userServices.findUserByEmail(req.body);
    const otp = otpServices.generateOTP();

    if (user && user.status !== "blocked") {
      return res.status(409).json({
        status: 409,
        message: "User duplicated",
        data: null
      });
    }

    await mailServices.sendEmail(req.body.email, otp);

    res.status(200).json({
      status: 200,
      message: "Success",
      data: user
    });
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: error,
      data: null
    });
  }
});

router.post("/auth/otp/register", async (req, res) => {
  try {
    const { otp, user } = req.body;
    const verify = otpServices.verifyOTP(otp);

    if (!verify)
      return res.status(400).json({
        message: "Wrong otp",
        status: 400,
        data: null
      });

    const registerUser = await userServices.registerUser(user);

    if (registerUser.status === "activated") {
      await mailServices.sendEmail(registerUser.email, registerUser.activated);
    }

    res.status(201).json({
      message: "success",
      status: 201,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      message: "internal server error",
      status: 500,
      data: null
    });
  }
});

module.exports = router;
