// hàm để gửi otp về gmail

const nodemailer = require("nodemailer");

module.exports.sendEmail = (email, subject, html) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIl_USER,
      pass: process.env.EMAIl_PASS,
    },
  });

  var mailOptions = {
    from: "kesterdaniel401@gmail.com",
    to: email,
    subject: subject,
    html: html,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
