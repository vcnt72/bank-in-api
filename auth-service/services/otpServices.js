const otplib = require("otplib");

const secret = "JRNGGKZSFNCVCL3SFNDGI2SEIFKVOWTBG5EUSRDDOVDGMNDWKVDWM3KHGNMXE";

otplib.authenticator.options = {
  step: 60,
  window: 1
};

exports.generateOTP = () => {
  return otplib.authenticator.generate(secret);
};

exports.verifyOTP = token => {
  return otplib.authenticator.check(token, secret);
};
