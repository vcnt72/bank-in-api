const nodemailer = require("nodemailer");
const User = require("../db/models").User;

exports.checkRejectedStatus = async request => {
  //delete password keys as it's not being checked
  //get keys
  const keys = Object.keys(request).filter(key => {
    return key !== "password";
  });

  const user = await User.findOne({
    where: {
      email: request.email
    }
  });

  //if user not in the db
  if (!user) {
    return false;
  }

  if (user.status === "accepted") {
    throw new Error("Duplicate data");
  }

  //validate for every data is same the data will be true
  const validation = keys.every(key => {
    return user[key] === request[key];
  });

  return validation;
};

exports.sendEmail = (email, textBody) => {
  // Make email user nodemailer

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "vincent.sanjayaaa@gmail.com",
      pass: "mateup123"
    },
    debug: true,
    logger: true
  });

  //The things that email send
  const mailOptions = {
    from: "vincent.sanjayaaa@gmail.com",
    to: email,
    subject: "Sending Email using Node.js",
    text: textBody
  };

  transporter
    .sendMail(mailOptions)
    .then(info => {
      console.log(info);
    })
    .catch(error => {
      throw new Error(error);
    });
};
