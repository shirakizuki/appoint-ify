import db from '../../config/db/db.js';

export default class TeacherModel {
    async deleteTeacher(teacherID) {
        const connection = await db.getConnection();
        const query = `
            DELETE FROM TeacherList
            WHERE teacherID = ?
            AND NOT EXISTS (
                SELECT 1
                FROM AppointmentList
                WHERE AppointmentList.teacherID = TeacherList.teacherID
                AND AppointmentList.appointmentStatus IN ('Active', 'Pending')
            );
        `;
        try {
            const queryOptions = { timeout: 10000 };
            const [result] = await connection.execute(query, [teacherID], queryOptions);
            return result;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }
}