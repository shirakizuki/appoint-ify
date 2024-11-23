import AuthController from '../../models/AuthModel.js';
import asyncHandler from 'express-async-handler'
import generateToken from '../../helpers/generateToken.js';
import { validatePassword } from '../../helpers/passwordHandler.js';

const authController = new AuthController();

const teacherLogin = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    if (!(email && password)) {
        return res.status(400).json({ success: false,message: 'Please enter both email and password' });
    }

    const user = await authController.getTeacherAccount(email);

    if (!user || !Array.isArray(user) || user.length === 0) {
        return res.status(401).json({
            success: false,
            message: 'Invalid login credentials. User not found'
        });
    }

    if (!(await validatePassword(user, password))) {
        return res.status(401).json({
            success: false,
            message: 'Password did not match with our system.'
        });
    }

    const token = generateToken(user[0].teacherID)

    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: "none",
        secure: false,
    });

    res.status(200).json({
        success: true,
        teacherID: user[0].teacherID,
        token,
    });
});

export default teacherLogin