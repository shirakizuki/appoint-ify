import asyncHandler from 'express-async-handler'
import transporter from "../../config/email.js"

import { createOTPMessage, createSuccessMesage } from "../../helpers/mailHandler.js"
import { generateOTP } from '../../services/otpServices.js';
import { generateOTPToken } from '../../services/otpServices.js';

const sendOneTimePin = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Email is required." });
    }

    const otp = generateOTP();
    const message = createOTPMessage(email, otp);

    transporter.sendMail(message).then(() => {
        const token = generateOTPToken({otp, email});
        return res.status(200).json({
            message: "Email has been sent!",
            token
        });
    }).catch(error => {
        return res.status(500).json({
            error: error.message || "Internal Server Error"
        });
    });
})

const sendSuccess = asyncHandler(async (req, res) => {
    const {email, referenceCode} = req.body;

    if(!email || !referenceCode) {
        return res.status(400).json({ message: 'Email and reference code are required' });
    }

    const message = createSuccessMesage(email, referenceCode);

    transporter.sendMail(message).then(() => {
        return res.status(200).json({
            message: "Email has been sent!",
        });
    }).catch(error => {
        return res.status(500).json({
            error: error.message || "Internal Server Error"
        });
    });
})

export default {
    sendOneTimePin,
    sendSuccess
};