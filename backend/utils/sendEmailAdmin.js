const nodemailer = require('nodemailer');

const sendEmailAdmin = async options => {
    var transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD
        }
      });

      const message = {
        from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        html: options.message // Use "html" instead of "text" for HTML content
      }

      await transporter.sendMail(message);
}

module.exports = sendEmailAdmin;