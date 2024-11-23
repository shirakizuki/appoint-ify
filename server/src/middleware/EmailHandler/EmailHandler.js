import asyncHandler from 'express-async-handler'
import transporter from "../../config/email.js"

import { createOTPMessage } from "../../helpers/mailHandler.js"
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

export default sendOneTimePin;

const sendFormDetails = (refCode, email) => {
    if (!refCode || !email) {
        return res.status(400).json({ status: false, message: "SYSTEM ERROR!" })
    }

    const message = {
        from: 'MS_gHSH9O@trial-yzkq340droxld796.mlsender.net',
        to: email,
        subject: 'Thank you for booking with GiePoint',
        text: 'Your Reference Code is ${refCode}. This code is valid for 10 minutes.',
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
            <h2 style="text-align: center; color: #333;">Your One-Time Pin (OTP)</h2>
            <p style="color: #555;">Dear user,</p>
            <p style="color: #555;">Thank you for booking your appointment with us. Please have the copy of your reference code. You can use this to track your appointment status.:</p>
            <p style="color: #555;">Please keep your lines open, expect a call from the department to validate your appointment</p>
            
            <div style="text-align: center; margin: 20px 0;">
                <span style="display: inline-block; font-size: 24px; font-weight: bold; padding: 10px 20px; background-color: #007bff; color: white; border-radius: 5px;">${refCode}</span>
            </div>
    
            <p style="color: #555;">This reference code is only valid to this platform. If you did not request this code, please ignore this email or contact support.</p>
    
            <p style="color: #555;">Thank you,<br />The Support Team</p>
    
            <footer style="margin-top: 20px; text-align: center; font-size: 12px; color: #aaa;">
                <p>&copy; 2024 GiePoint. All rights reserved.</p>
            </footer>
        </div>
        `
    };

    transporter.sendMail(message)
}