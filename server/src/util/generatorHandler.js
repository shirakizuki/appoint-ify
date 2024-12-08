import jwt from "jsonwebtoken";
import crypto from 'crypto'

export const generateRefCode = () => {
    return Math.random().toString(36).substring(2, 12).toUpperCase();
}

export const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

export const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

export const generateOTPToken = ({otp, email}) => {
    return jwt.sign({ aud: otp, email }, process.env.JWT_SECRET, {
        expiresIn: "5m",
    });
}

export const generateSalt = (length) => crypto.randomBytes(length).toString('hex');