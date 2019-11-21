const axios = require("axios").default;
const jwt = require("jsonwebtoken");

const isAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    const verify = await axios.post("http://localhost:3000/auth", {
      token
    });

    if (verify.data.status === 404) {
      return res.status(404).json({
        message: "Not found",
        status: 404,
        data: null
      });
    }

    // eslint-disable-next-line require-atomic-updates
    req.decode = jwt.verify(token, "secret");

    next();
  } catch (error) {
    res.status(401).json({
      message: "Not authorized",
      status: 401,
      data: null
    });
  }
};

module.exports = isAuth;
