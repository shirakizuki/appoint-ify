import asyncHandler from 'express-async-handler';
import TeacherModel from '../../model/Teacher/deleteTeacherModel.js';
import { verifyToken } from '../../helper/tokenChecker.js';

const teacherModel = new TeacherModel();

export const deleteTeacher = [verifyToken, asyncHandler(async (req, res) => {
    const { teacherID } = req.query;

    if (!teacherID) {
        return res.status(400).json({ message: 'Request body is empty.' });
    }

    const result = await teacherModel.deleteTeacher(teacherID);

    if(result.affectedRows > 0) {
        return res.status(200).json({
            message: 'Teacher deleted successfully.'
        });
    } else {
        return res.status(202).json({
            message: 'Failed to delete teacher. An appointment is still active or pending.'
        });
    }
})]