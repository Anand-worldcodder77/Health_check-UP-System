const nodemailer = require('nodemailer');

const sendEmail = async (userEmail, subject, text) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Email credentials not configured. Skipping email send.');
      return false;
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"HealthChecks" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject,
      text,
    });

    console.log('Email sent successfully.');
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
};

module.exports = sendEmail;
