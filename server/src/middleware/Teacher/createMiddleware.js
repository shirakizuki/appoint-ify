import TeacherModel from '../../model/Teacher/createTeacherModel.js';
import asyncHandler from 'express-async-handler';
import { verifyToken } from '../../helper/tokenChecker.js';
import { generateSalt } from '../../util/generatorHandler.js';
import { createSaltedHash } from '../../util/passwordHandler.js';
import { validatePassword, valudateEmail, validateContactNumber } from '../../helper/formChecker.js';

const teacherModel = new TeacherModel();

export const createTeacher = [verifyToken, asyncHandler(async (req, res) => {
    const { departmentID, firstName, lastName, teacherEmail, contactNumber, teacherPassword, teacherConfirmPassword } = req.body;

    if (!(departmentID && firstName && lastName && teacherEmail && contactNumber && teacherPassword && teacherConfirmPassword)) {
        return res.status(400).json({ message: 'Request body is empty.' });
    }

    if (teacherPassword !== teacherConfirmPassword) {
        return res.status(400).json({ message: 'Password did not match.' });
    }

    if (!validatePassword(teacherPassword)) {
        return res.status(400).json({ message: 'Password must be at least 8 characters long.'});
    }

    if (!valudateEmail(teacherEmail)) {
        return res.status(400).json({ message: 'Valid email is required.' });
    }

    if (!validateContactNumber(contactNumber)) {
        return res.status(400).json({ message: 'A valid 11-digit contact number is required.' });
    }

    const generatedSalt = generateSalt(16);
    const hashPassword = createSaltedHash(teacherPassword, generatedSalt);

    try {
        const result = await teacherModel.createTeacher(departmentID, firstName, lastName, teacherEmail, contactNumber, generatedSalt, hashPassword);
        if(result > 0) {
            return res.status(201).json({
                message: 'Teacher created successfully.'
            });
        } else if (result===0) {
            return res.status(202).json({
                message: 'Email or contact number already exists.'
            });
        }

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: 'Something went wrong.'
        });
    }
})]