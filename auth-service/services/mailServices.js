const nodemailer = require("nodemailer");

exports.sendEmail = async (email, textBody) => {
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

  await transporter.sendMail(mailOptions);
};
