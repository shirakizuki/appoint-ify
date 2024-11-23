import ScheduleController from '../../models/ScheduleController.js'
import verifyToken from '../../helpers/validateToken.js';
import asyncHandler from 'express-async-handler'

const scheduleController = new ScheduleController();

/**
 * @description Middleware to update a teacher's weekly schedule.
 * @param {Object} req - The request object.
 * @param {number} req.body.teacherID - The ID of the teacher whose schedule is to be updated.
 * @param {Object[]} req.body.newSlots - An array of objects with the following properties: dayOfWeek, startTime, endTime.
 * @param {Object[]} req.body.updatedSlots - An array of objects with the following properties: dayOfWeek, startTime, endTime, oldStartTime, oldEndTime.
 * @param {number[]} req.body.removedSlots - An array of schedule IDs to be deleted.
 * @param {Object} res - The response object.
 * @returns {void}
 * @throws {Error} If there is an issue with the database query.
 */
const updateWeeklySchedule = [verifyToken, asyncHandler(async (req, res) => {
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

    const result = await scheduleController.saveWeeklySchedule(teacherID, valuesToInsert, valuesToUpdate, valuesToDelete);

    res.status(200).json({
        status: 'success',
        message: result.message
    });
})]

export default updateWeeklySchedule