import asyncHandler from 'express-async-handler';
import transporter from '../../config/mail/email.js';

import { createOTPMessage, createSuccessMesage, createApproveMessage, createDeclineMessage, createCancelledMessage } from "../../constant/emailFormats.js";
import { generateOTP, generateOTPToken } from '../../util/generatorHandler.js';

// FOR OTP EMAIL
export const sendOneTimePin = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if(!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    const otp = generateOTP();
    const message = createOTPMessage(email, otp);

    transporter.sendMail(message).then(() => {
        return res.status(200).json({
            message: "Email has been sent!",
            token: generateOTPToken({otp, email})
        });
    }).catch(error => {
        return res.status(500).json({ message: error.message });
    });
})

// FOR SUCCESS OR APPOINTMENT WAS SUBMITTED FOR APPROVAL
export const sendSuccess = asyncHandler(async (req, res) => {
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

// FOR APPOINTMENT WAS APPROVED // ACTIVE
export const sendApprove = asyncHandler(async (req, res) => {
    const { email, referenceCode, content } = req.body;

    if(!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    const message = createApproveMessage(email);

    transporter.sendMail(message).then(() => {
        return res.status(200).json({
            message: "Email has been sent!",
        });
    }).catch(error => {
        return res.status(500).json({ message: error.message });
    });
})

// FOR APPOINTMENT WAS DECLINED
export const sendDecline = asyncHandler(async (req, res) => {
    const { email, cancelReason } = req.body;

    if(!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    const message = createDeclineMessage(email, cancelReason);

    transporter.sendMail(message).then(() => {
        return res.status(200).json({
            message: "Email has been sent!",
        });
    }).catch(error => {
        return res.status(500).json({ message: error.message });
    });
})

// FOR APPOINTMENT WAS DECLINED
export const sendCancelled = asyncHandler(async (req, res) => {
    const { email, cancelReason } = req.body;

    if(!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    const message = createCancelledMessage(email, cancelReason);

    transporter.sendMail(message).then(() => {
        return res.status(200).json({
            message: "Email has been sent!",
        });
    }).catch(error => {
        return res.status(500).json({ message: error.message });
    });
})