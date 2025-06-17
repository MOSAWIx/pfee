const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
        user: process.env.EMAIL, 
        pass: process.env.EMAIL_PASSWORD  
    }
});

const sendEmail = async ({ to, subject, html }) => {
    try {
        if (!to) throw new Error("No recipient email provided");

        const mailOptions = {
            from: `"Ephorea Ecommerce App" <${process.env.EMAIL_SENDER}>`,
            to: to,
            subject: subject,
            html: html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
        return info;
    } catch (error) {
        console.error('Email sending error:', error);
        throw error;
    }
};

// Verify connection on startup
transporter.verify()
    .then(() => console.log('Email server connection verified'))
    .catch(err => console.error('Email server connection failed:', err));

module.exports = { sendEmail };