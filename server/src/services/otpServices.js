import jwt from "jsonwebtoken";
import dotenv from 'dotenv'
import asyncHandler from 'express-async-handler'

dotenv.config()

export const generateOTP = () => {
    return Math.floor(10000 + Math.random() * 90000).toString();
}

export const generateOTPToken = ({otp, email}) => {
    return jwt.sign({ aud: otp, email }, process.env.JWT_SECRET, {
        expiresIn: "5m",
    });
}

export const validateOTP = asyncHandler(async (req, res) => {
    const {otpCode, token} = req.body;

    if(!otpCode || !token) {
        return res.status(400).json({
            message: "OTP and token are required."
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (otpCode.toString() === decoded.aud && decoded.exp > Date.now() / 1000) {
            return res.status(200).json({
                message: "OTP validated successfully."
            });
        } else {
            return res.status(401).json({
                message: "Invalid OTP"
            });
        }
    } catch (error) {
        console.error("Error verifying token:", error);
        return res.status(400).json({ message: "OTP has expired or is invalid." });
    }
})