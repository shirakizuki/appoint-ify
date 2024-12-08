import AdminModel from '../../model/Admin/deleteAdminModel.js';
import asyncHandler from 'express-async-handler';
import { verifyToken } from '../../helper/tokenChecker.js';

const adminModel = new AdminModel();

export const deleteAdminAccount = [verifyToken, asyncHandler(async (req, res) => {
    const { accountID, departmentID } = req.query;

    if (!(accountID && departmentID)) {
        return res.status(400).json({ message: 'Request body is empty.' });
    }

    const result = await adminModel.deleteAdminAccount(accountID, departmentID);
    console.log(result);
    if(result && result.affectedRows > 0) {
        return res.status(200).json({
            message: 'Admin deleted successfully.'
        });
    } else {
        return res.status(202).json({
            message: 'A department must atleast have one admin account.'
        });
    }
})]