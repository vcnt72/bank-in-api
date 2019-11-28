const User = require("../db/models").User;
const axios = require("axios").default;

exports.isAdmin = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    const auth = await axios.get("http://localhost:3000/auth", {
      token
    });

    const user = await User.findOne({
      where: {
        email: auth.data.data.user
      }
    });

    if (user.role !== "admin") {
      throw new Error("not admin");
    }
    // eslint-disable-next-line require-atomic-updates
    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({
      message: "Not Authorized",
      status: 401,
      data: null
    });
  }
};

exports.isAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    const auth = await axios.get("http://localhost:3000/auth", {
      token
    });

    const user = await User.findOne({
      where: {
        email: auth.data.data.user
      }
    });
    // eslint-disable-next-line require-atomic-updates
    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({
      message: "Not Authorized",
      status: 401,
      data: null
    });
  }
};
