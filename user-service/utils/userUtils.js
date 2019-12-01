const bcrypt = require("bcryptjs");

exports.verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
