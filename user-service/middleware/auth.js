const jwt = require("jsonwebtoken");
const User = require("../db/models").User;

exports.isAdmin = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    const decoded = jwt.verify(token, "secret");

    const user = await User.findOne({
      where: { phoneNumber: decoded.phoneNumber, token }
    });

    if (user.role != "admin") {
      throw new Error();
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

    const decoded = jwt.verify(token, "secret");

    const user = await User.findOne({
      where: { phoneNumber: decoded.phoneNumber, token }
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
