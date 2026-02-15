const nodemailer = require("nodemailer");

const sendOtpMail = async (otp) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: "Admin Login OTP - CivicEcho",
    text: `Your OTP for Admin Login is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendOtpMail;