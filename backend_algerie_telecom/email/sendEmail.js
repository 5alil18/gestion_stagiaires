const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.email,
    pass: process.env.pass,
  },
});

const senderEmail = async (email, url , subject) => {
  await transporter.sendMail({
    from: process.env.email,
    to: email,
    subject: subject,
    html: `
        <h2>welcome</h2>
        <p>click the button</p>
        <a href='${url}'>verify your email</a>
        `,
  });
  console.log("email is sended to " +email)
};

module.exports = senderEmail;
