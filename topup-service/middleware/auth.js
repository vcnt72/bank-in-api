const axios = require("axios").default;

const isAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    const verify = await axios.post("http://localhost:3000/auth", {
      token
    });

    if (verify.status === 404) {
      return res.status(404).json({
        message: "Not found",
        status: 404,
        data: null
      });
    }

    const auth = await axios.post("http://localhost:3001/users/find", {
      email: verify.data.data.user.email
    });
    // eslint-disable-next-line require-atomic-updates
    req.auth = auth.data.data;
    // eslint-disable-next-line require-atomic-updates
    req.token = token;

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
