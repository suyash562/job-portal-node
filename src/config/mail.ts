import nodemailer, { Transporter } from 'nodemailer';


export const transporter : Transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_USER_PASS,
    },
});
