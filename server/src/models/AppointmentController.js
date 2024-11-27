import db from '../db/db.js';

export default class AppointmentController {
    async getDepartmentList() {
        const query = `
            SELECT * FROM DepartmentList;
        `;

        const connection = await db.getConnection();
        try {
            const [departmentList] = await connection.query(query);
            return departmentList;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    async readTeacherList(departmentID) {
        const query = `
            SELECT
                teacherID,
                CONCAT(firstName, ' ', lastName) AS fullName
            FROM TeacherList
            WHERE departmentID = ?;
        `;

        const connection = await db.getConnection();
        try {
            const [result] = await connection.execute(query, [departmentID]);
            return result;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    async readScheduleSlot(inputDate, teacherID) {
        const query = `CALL GetScheduleForDate(?,?);`;
        const connection = await db.getConnection();
        try {
            const [result] = await connection.execute(query, [inputDate, teacherID]);
            return result;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    async readDurationLimiter(scheduleID, selectedDate) {
        const query = `SELECT CalRemainingDuration(?,?) As remainingDuration;`;
        const connection = await db.getConnection();
        try {
            const [result] = await connection.execute(query, [scheduleID, selectedDate]);
            return result;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    async createAppointment(formData, referenceCode) {
        const {
            departmentID,
            teacherID,
            appointmentDate,
            scheduleID,
            appointmentPurpose,
            appointmentDuration,
            firstName,
            lastName,
            email,
            phoneNumber,
            course,
            currentYear,
            studentID
        } = formData;

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

    async readAppointmentList(departmentID, teacherID) {
        const query = `
            SELECT 
                ap.appointmentID,
                ap.departmentID,
                ap.teacherID,
                CONVERT_TZ(appointmentDate, '+00:00', '+08:00') as appointmentDate,
                ap.scheduleID,
                ap.referenceCode,
                ap.appointmentPurpose,
                ap.appointmentDuration,
                ap.appointmentStatus,
                ap.cancelReason,
                we.startTime,
                we.endTime,
                tl.firstName AS teacherFirstName,
                tl.lastName AS teacherLastName,
                si.firstName AS studentFirstName,
                si.lastName AS studentLastName,
                si.email,
                si.phoneNumber,
                si.course,
                si.currentYear,
                si.studentID
            FROM AppointmentList ap
            LEFT JOIN WeeklySchedule we
                ON we.scheduleID = ap.scheduleID
            LEFT JOIN TeacherList tl
                ON tl.teacherID = ap.teacherID
            LEFT JOIN StudentInformation si
                ON si.appointmentID = ap.appointmentID
            WHERE ap.departmentID = ? OR ap.teacherID = ?
            ORDER BY ap.appointmentDate DESC;
        `;
        const connection = await db.getConnection();
        try {
            const [result] = await connection.execute(query, [departmentID, teacherID]);
            return result;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    async approveAppointment(appointmentID) {
        const query = `
            UPDATE AppointmentList
            SET appointmentStatus = 'Approved'
            WHERE appointmentID = ?;
        `;
        const connection = await db.getConnection();
        try {
            const [result] = await connection.execute(query, [appointmentID]);
            const affectedRows = result.affectedRows;
            return affectedRows;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    async declineAppointment(appointmentID, cancelReason) {
        const query = `
            UPDATE AppointmentList
            SET cancelReason = ?, appointmentStatus = 'Declined'
            WHERE appointmentID = ?;
        `;
        const connection = await db.getConnection();
        try {
            const [result] = await connection.execute(query, [cancelReason, appointmentID]);
            const affectedRows = result.affectedRows;
            return affectedRows;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }
}