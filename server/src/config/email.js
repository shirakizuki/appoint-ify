import nodemailer from 'nodemailer'
import dotenv from  "dotenv"

dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.mailersend.net",
    port: 587,
    secure: false,
    auth: {
        type: 'login',
        user: process.env.MAILERSEND_USERNAME,
        pass: process.env.MAILERSEND_PASSWORD,
    },
    logger: true,
    debug: true
})

export default transporter;