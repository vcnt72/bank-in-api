const axios = require("axios").default;

exports.postMutation = async (mutationBody, token) => {
  try {
    const mutation = await axios.post(
      "http://localhost:3002/mutations",
      {
        ...mutationBody
      },
      {
        headers: {
          Authorization: token
        }
      }
    );
    return mutation.data.data;
  } catch (error) {
    throw new Error(error);
  }
};
