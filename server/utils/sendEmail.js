const nodemailer = require('nodemailer');

const sendEmail = async (userEmail, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Aapka Gmail
        pass: process.env.EMAIL_PASS  // Aapka App Password
      }
    });

    await transporter.sendMail({
      from: `"City Lab" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: subject,
      text: text
    });

    console.log("📧 Email sent successfully!");
  } catch (error) {
    console.error("❌ Email error:", error);
  }
};

module.exports = sendEmail;