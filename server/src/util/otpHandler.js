import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

export const validateOTP = asyncHandler(async (req, res) => {
    const {otpValue, token} = req.body;

    if(!otpValue || !token) {
        return res.status(400).json({
            message: "OTP and token are required."
        })
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (otpValue.toString() === decoded.aud && decoded.exp > Date.now() / 1000) {
            return res.status(200).json({
                message: "OTP validated successfully."
            });
        } else {
            return res.status(401).json({
                message: "Invalid OTP"
            });
        }
    } catch (error) {
        return res.status(400).json({ message: "OTP has expired or is invalid." });
    }
})