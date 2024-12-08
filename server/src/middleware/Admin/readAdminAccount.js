import asyncHandler from 'express-async-handler';
import { verifyToken } from '../../helper/tokenChecker.js';
import AdminModel from '../../model/Admin/readAdminModel.js';
import { generateToken } from '../../util/generatorHandler.js';
import { validatePassword } from '../../helper/passwordChecker.js';

const adminModel = new AdminModel();

export const adminLogin = asyncHandler(async (req, res) => {
    
    const { username, password } = req.body;

    if (!(username && password)) {
        return res.status(400).json({ message: 'Please enter both username and password' });
    }

    try {
        const user = await adminModel.getDepartmentAccount(username);

        if (!user || !Array.isArray(user) || user.length === 0) {
            return res.status(401).json({
                message: 'Invalid login credentials. User not found'
            });
        }

        const saltPassword = user[0].saltPassword;
        const hashdPassword = user[0].hashPassword;

        if (!(await validatePassword(password, saltPassword, hashdPassword))) {
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
            departmentID: user[0].departmentID,
            accountID: user[0].accountID,
            token,
        });
    } catch (error) {
        throw error;
    }
});

export const getAllDepartmentAccount = [verifyToken, asyncHandler(async (req, res) => { 
    const { departmentID, searchQuery } = req.query;

    if (!departmentID) {
        return res.status(400).json({ message: 'Request body is empty.' });
    }

    const result = await adminModel.readAllDepartmentAccount(departmentID, searchQuery);

    return res.status(200).json({
        adminList: result
    });
})];