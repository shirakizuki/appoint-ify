import asyncHandler from 'express-async-handler'
import TeacherModel from '../../model/Teacher/createTeacherModel.js';
import UpdateModel from '../../model/Teacher/updateTeacher.js';
import { verifyToken } from '../../helper/tokenChecker.js';
import { generateSalt } from '../../util/generatorHandler.js';
import { createSaltedHash } from '../../util/passwordHandler.js';
import { validatePassword } from '../../helper/passwordChecker.js';

const teacherModel = new TeacherModel();
const updateModel = new UpdateModel();

export const updateWeeklySchedule = [verifyToken, asyncHandler(async (req, res) => {
    const { teacherID, newSlots, updatedSlots, removedSlots } = req.body;

    if (!teacherID || !Array.isArray(newSlots) || !Array.isArray(updatedSlots) || !Array.isArray(removedSlots)) {
        return res.status(400).json({
            status: 'fail',
            message: 'Missing or invalid teacherID, newSlots, updatedSlots, or removedSlots data.'
        });
    }

    const valuesToInsert = newSlots.flatMap(({ dayOfWeek, slots }) =>
        Array.isArray(slots) && slots.length > 0
            ? slots.map(slot => [teacherID, dayOfWeek, slot.startTime, slot.endTime])
            : []
    );

    const valuesToDelete = removedSlots.flatMap(slot => [slot.scheduleID]);

    const valuesToUpdate = updatedSlots.flatMap(({ dayOfWeek, slots }) =>
        Array.isArray(slots) && slots.length > 0
            ? slots.map(slot => [
                slot.newStartTime,
                slot.newEndTime,
                teacherID,
                dayOfWeek,
                slot.oldStartTime,
                slot.oldEndTime
            ])
            : []
    );

    const result = await teacherModel.saveWeeklySchedule(teacherID, valuesToInsert, valuesToUpdate, valuesToDelete);

    res.status(200).json({
        message: result.message
    });
})]

export const updateTeacherInfo = [verifyToken, asyncHandler(async (req, res) => {
    const { teacherID, firstName, lastName, teacherEmail, contactNumber } = req.body;

    if (!teacherID || !firstName || !lastName || !teacherEmail || !contactNumber) {
        return res.status(400).json({
            message: 'Missing or invalid teacherID, firstName, lastName, teacherEmail, or contactNumber data.'
        });
    }

    const result = await updateModel.updateTeacherInfo(teacherID, firstName, lastName, teacherEmail, contactNumber);

    if(result.affectedRows > 0) {
        return res.status(201).json({
            message: 'Teacher updated successfully.'
        });
    }
})]

export const updateTeacherPassword = [verifyToken, asyncHandler(async (req, res) => {
    const { teacherID, oldPassword, newPassword } = req.body;

    if (!teacherID || !oldPassword || !newPassword) {
        return res.status(400).json({
            message: 'Missing or invalid teacherID, oldPassword, or newPassword data.'
        });
    }

    const user = await updateModel.updatePassword(teacherID);

    const saltPassword = user.saltPassword;
    const hashdPassword = user.hashPassword;

    if (!(await validatePassword(oldPassword, saltPassword, hashdPassword))) {
        return res.status(401).json({
            message: 'Password did not match with our system.'
        });
    }

    if (newPassword === oldPassword) {
        return res.status(400).json({
            message: 'New password cannot be the same as the old password.'
        });
    }

    const salt = generateSalt(16);
    const hashedPassword = createSaltedHash(newPassword, salt);

    const result = await updateModel.updateTeacherPassword(salt, hashedPassword, teacherID);

    if(result.affectedRows > 0) {
        return res.status(201).json({
            message: 'Password updated successfully.'
        });
    }
})]