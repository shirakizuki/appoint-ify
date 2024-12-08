import asyncHandler from 'express-async-handler';
import TeacherModel from '../../model/Teacher/readTeacherModel.js';
import { verifyToken } from '../../helper/tokenChecker.js';
import { generateToken } from '../../util/generatorHandler.js';
import { validatePassword } from '../../helper/passwordChecker.js';

const teacherModel = new TeacherModel();

export const teacherLogin = asyncHandler(async (req, res) => {

    const { email, password } = req.body;

    if (!(email && password)) {
        return res.status(400).json({ success: false, message: 'Please enter both email and password' });
    }

    const user = await teacherModel.readTeacherAccount(email);

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

    const token = generateToken(user[0].teacherID)

    res.cookie("token", token, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: "none",
        secure: false,
    });

    res.status(200).json({
        teacherID: user[0].teacherID,
        token,
    });
});

export const readAllTeachers = [verifyToken, asyncHandler(async (req, res) => {
    const { departmentID, searchQuery } = req.query;

    if (!departmentID) {
        return res.status(400).json({ message: 'Request body is empty.' });
    }

    const result = await teacherModel.readAllTeachers(departmentID, searchQuery);

    return res.status(200).json({
        teacherList: result
    });
})]

export const readCurrentTeacherSchedule = [verifyToken, asyncHandler(async (req, res) => {
    const { teacherID } = req.query;

    if (!teacherID) {
        return res.status(400).json({ message: 'Request body is empty.' });
    }

    const result = await teacherModel.readCurrentTeacherSchedule(teacherID);

    return res.status(200).json({
        teacherSchedule: result
    });
})]

export const readWeeklySchedule = [verifyToken, asyncHandler(async (req, res) => {
    const { teacherID } = req.query;

    if (!teacherID) {
        return res.status(400).json({ message: 'Request body is empty.' });
    }

    const result = await teacherModel.readWeeklySchedule(teacherID);
    res.status(200).json({ scheduleList: result });
})]

export const readDashboardData = [verifyToken, asyncHandler(async (req, res) => {
    const { teacherID } = req.query;

    if (!teacherID) {
        return res.status(400).json({ message: 'Request body is empty.' });
    }

    const result = await teacherModel.readDashboardData(teacherID);
    return res.status(200).json({ dashboardData: result });
})]

export const readTeacher = [verifyToken, asyncHandler(async (req, res) => {
    const { teacherID } = req.query;

    if (!teacherID) {
        return res.status(400).json({ message: 'Request body is empty.' });
    }
    const result = await teacherModel.readTeacher(teacherID);
    return res.status(200).json({ teacher: result });
})]