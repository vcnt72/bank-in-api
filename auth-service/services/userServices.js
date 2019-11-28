const axios = require("axios").default;
const bcrypt = require("bcrypt");

exports.registerUser = async details => {
  const user = await axios.post("http://localhost:3001/users", {
    ...details
  });

  if (user.status === 404) return null;

  if (user.status === 500) throw new Error(user.data.message);

  const userDetails = user.data.data;

  if (userDetails.status === "blocked") {
    const updateUser = await axios.patch(
      "http://localhost:3001/users/public/status",
      {
        id: userDetails.id,
        status: "activated"
      }
    );

    return updateUser.data.data[0];
  }
  return userDetails;
};

exports.findUserByEmail = async details => {
  try {
    const user = await axios.post("http://localhost:3001/users/find", {
      ...details
    });

    if (user.status === 200) return null;

    if (user.status === 500) throw new Error(user.data.message);

    const userDetails = user.data.data;
    return userDetails;
  } catch (error) {
    throw new Error(error);
  }
};

exports.findUserCredentials = async details => {
  const getCredential = await axios.post("http://localhost:3001/users/find", {
    email: details.email
  });

  if (getCredential.status === 208) return null;

  if (getCredential.status === 500) throw new Error(getCredential.data.message);

  const credentialDetail = getCredential.data.data;

  const { password: hash } = credentialDetail;

  return {
    isCredentials: await bcrypt.compare(details.password, hash),
    user: credentialDetail
  };
};
