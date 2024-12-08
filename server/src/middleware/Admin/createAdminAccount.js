import AdminModel from '../../model/Admin/createAdminModel.js';
import asyncHandler from 'express-async-handler';
import { verifyToken } from '../../helper/tokenChecker.js';
import { generateSalt } from '../../util/generatorHandler.js';
import { createSaltedHash } from '../../util/passwordHandler.js';
import { validatePassword } from '../../helper/formChecker.js';

const adminModel = new AdminModel();

export const createAdmin = [verifyToken, asyncHandler(async (req, res) => {
    const { departmentID, accountUsername, password, firstName, lastName } = req.body;

    if (!(departmentID && accountUsername && password && firstName && lastName)) {
        return res.status(400).json({ message: 'Request body is empty.' });
    }

    if (!validatePassword(password)) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long.'});
    }

    const generatedSalt = generateSalt(16);
    const hashPassword = createSaltedHash(password, generatedSalt);

    try {
        const result = await adminModel.createAdmin(departmentID, accountUsername, generatedSalt, hashPassword, firstName, lastName);
        if(result.affectedRows > 0) {
            return res.status(201).json({
                message: 'Admin created successfully.'
            });
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: 'Something went wrong.'
        });
    }
})]