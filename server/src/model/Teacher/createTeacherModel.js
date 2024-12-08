import db from '../../config/db/db.js';

export default class TeacherModel {
    async createTeacher(departmentID, firstName, lastName, teacherEmail, contactNumber, saltPassword, hashPassword) {
        const connection = await db.getConnection();
        try {

            await connection.execute(
                `CALL createTeacher(?, ?, ?, ?, ?, ?, ?, @affectedRows);`,
                [departmentID, firstName, lastName, teacherEmail, contactNumber, saltPassword, hashPassword]
            );

            const [affectedRowsResult] = await connection.query(`SELECT @affectedRows AS affectedRows;`);
            const affectedRows = affectedRowsResult[0].affectedRows;
            return affectedRows;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

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
            return { message: 'Weekly schedule saved successfully' };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
}