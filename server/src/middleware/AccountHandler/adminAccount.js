import LoginController from '../../models/AuthModel.js';
import asyncHandler from 'express-async-handler'
import generateToken from '../../helpers/generateToken.js';
import { validatePassword } from '../../helpers/passwordHandler.js';

const loginController = new LoginController();

const departmentLogin = asyncHandler(async (req, res) => {

    const { username, password } = req.body;

    if (!(username && password)) {
        return res.status(400).json({ message: 'Please enter both username and password' });
    }

    try {
        const user = await loginController.getDepartmentAccount(username);

        if (!user || !Array.isArray(user) || user.length === 0) {
            return res.status(401).json({
                message: 'Invalid login credentials. User not found'
            });
        }

        if (!(await validatePassword(user, password))) {
            return res.status(401).json({
                message: 'Password did not match with our system.'
            });
        }

        const token = generateToken(user[0].accountID)

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 30 * 24 * 60 * 60 * 1000,
            sameSite: "none",
            secure: false,
        });

        res.status(200).json({
            message: 'Login successful',
            departmentID: user[0].departmentID,
            token,
        });
    } catch (error) {
        throw error;
    }
});

export default departmentLogin