import db from '../../config/db/db.js';

export default class AppointmentModel {
    async createAppointment(
        departmentID,
        teacherID, 
        appointmentDate, 
        scheduleID,
        referenceCode,
        appointmentPurpose,
        appointmentDuration,
        firstName,
        lastName,
        email,
        phoneNumber,
        course,
        currentYear,
        studentID) {

        const query = `CALL CreateAppointment(?,?,?,?,?,?,?,?,?,?,?,?,?,?);`;
        const connection = await db.getConnection();
        try {
            const [result] = await connection.execute(query, [
                departmentID,
                teacherID,
                appointmentDate,
                scheduleID,
                referenceCode,
                appointmentPurpose,
                appointmentDuration,
                firstName,
                lastName,
                email,
                phoneNumber,
                course,
                currentYear,
                studentID,
            ]);
            return result;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }
}