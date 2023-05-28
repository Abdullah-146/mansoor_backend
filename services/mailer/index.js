import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transportOptions = {
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_SERVICE_USERNAME,
    pass: process.env.EMAIL_SERVICE_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(transportOptions);
const sendEmail = (opts = {}) => {
  transporter.sendMail(opts, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

export { sendEmail };
