import ScheduleController from "../../controllers/ScheduleController.js";
import verifyToken from "../../config/Tokenizer/Tokenizer.js";

const scheduleController = new ScheduleController();

/**
 * @function
 * @param {Object} req - The Express request object.
 * @param {Object} req.query - The query parameters of the request.
 * @param {number} req.query.teacherID - The ID of the teacher whose schedule is to be retrieved.
 * @param {Object} res - The Express response object.
 * @description
 * Retrieves the weekly schedule for a given teacher ID.
 * The schedule is returned as an array of objects with the following properties: scheduleID, dayOfWeek, startTime, endTime.
 * If there is an error with the database query, an error is thrown.
 * @throws Will throw an error if there is an issue with the database query.
 */
const readWeeklySchedule = [verifyToken, async (req, res) => {
    const { teacherID } = req.query;

    if( !teacherID ) {
        return res.status(400).json({
            status: 'fail',
            message: 'Missing teacherID '
        });
    }

    try {
        const result = await scheduleController.getWeeklySchedule(teacherID);
        res.status(200).json({
            status: 'success',
            scheduleList: result
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: 'fail',
            message: 'Internal server error'
        })
    }
}]

export default readWeeklySchedule;