const axios = require("axios");

exports.findUserByEmail = async details => {
  try {
    const user = await axios.post("http://localhost:3001/users/find", {
      ...details
    });

    if (user.status === 500) throw new Error(user.data.message);

    const userDetails = user.data.data;
    return userDetails;
  } catch (error) {
    throw new Error(error);
  }
};
