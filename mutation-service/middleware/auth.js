const axios = require("axios").default;

const isAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    const verify = await axios.post("http://localhost:3000/auth", {
      token
    });

    if (verify.status === 401) {
      return res.status(401).json({
        message: "Unauthorized",
        status: 401,
        data: null
      });
    }

    // eslint-disable-next-line require-atomic-updates
    req.decode = verify.data.data.user;

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
