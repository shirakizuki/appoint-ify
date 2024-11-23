import db from '../db/db.js';

export default class ScheduleController {
    
    /**
     * Retrieves the weekly schedule for a given teacher ID.
     * The schedule is returned as an array of objects with the following properties:
     * - scheduleID (string): The ID of the schedule
     * - dayOfWeek (string): The day of the week (e.g., Monday)
     * - startTime (string): The start time of the schedule in the format HH:mm
     * - endTime (string): The end time of the schedule in the format HH:mm
     * The query is ordered by the day of the week and start time.
     * If there is an error with the database query, an error is thrown.
     * @param {number} teacherID - The ID of the teacher whose schedule is to be retrieved.
     * @returns {Promise<Object[]>} A promise that resolves to an array of schedule objects.
     * @throws Will throw an error if there is an issue with the database query.
     */
    async getWeeklySchedule(teacherID) {
        const query = `
            SELECT 
                scheduleID, 
                dayOfWeek, 
                startTime, 
                endTime 
            FROM WeeklySchedule
            WHERE teacherID = ?
            ORDER BY FIELD(dayOfWeek, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'), startTime;
        `;
        const connection = await db.getConnection();
        try {
            const [result] = await connection.execute(query, [teacherID]);
            return result;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    /**
     * Saves the weekly schedule for the given teacher ID.
     * 
     * This method deletes the specified schedule IDs, updates the specified schedule values, and inserts the specified new schedule values.
     * The method is transactional. If any of the operations fail, the transaction is rolled back.
     * The method returns a success message if the transaction is committed successfully.
     * If there is an error during the transaction, an error is thrown.
     * 
     * @param {number} teacherID - The ID of the teacher whose schedule is to be saved.
     * @param {Object[]} valuesToInsert - An array of objects with the following properties to be inserted into the table: teacherID, dayOfWeek, startTime, endTime.
     * @param {Object[]} valuesToUpdate - An array of objects with the following properties to be updated in the table: teacherID, dayOfWeek, startTime, endTime, oldStartTime, oldEndTime.
     * @param {number[]} valuesToDelete - An array of schedule IDs to be deleted from the table.
     * @returns {Promise<Object>} A promise that resolves to an object with the following properties: status, message.
     * @throws Will throw an error if there is an issue with the database query.
     */
    async saveWeeklySchedule(teacherID, valuesToInsert, valuesToUpdate, valuesToDelete) {
        const deleteQuery = `
            DELETE 
            FROM WeeklySchedule 
            WHERE scheduleID = ?;
        `;
        const insertQuery = `
            INSERT INTO WeeklySchedule 
                (teacherID, 
                dayOfWeek, 
                startTime, 
                endTime) 
            VALUES ?;
        `;
        const updateQuery = `
            UPDATE WeeklySchedule 
            SET 
                startTime = ?, 
                endTime = ? 
            WHERE teacherID = ? AND dayOfWeek = ? AND startTime = ? AND endTime = ?;
        `;
    
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
    
            if (valuesToDelete.length > 0) {
                for (let i = 0; i < valuesToDelete.length; i++) {
                    const scheduleID = valuesToDelete[i];
                    await connection.execute(deleteQuery, [scheduleID]);
                }
            }
    
            if (valuesToUpdate.length > 0) {
                for (let i = 0; i < valuesToUpdate.length; i++) {
                    const [newStartTime, newEndTime, teacherID, dayOfWeek, oldStartTime, oldEndTime] = valuesToUpdate[i];
                    await connection.execute(updateQuery, [
                        newStartTime,
                        newEndTime,
                        teacherID,
                        dayOfWeek,
                        oldStartTime,
                        oldEndTime,
                    ]);
                }
            }

            if (valuesToInsert.length > 0) {
                await connection.query(insertQuery, [valuesToInsert]);
            }
    
            await connection.commit();
            return { status: 'success', message: 'Weekly schedule saved successfully' };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}