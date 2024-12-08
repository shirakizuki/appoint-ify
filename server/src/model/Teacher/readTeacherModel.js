import db from '../../config/db/db.js';

export default class TeacherModel {
    async readTeacherAccount(email) {
        const query = `
            SELECT
                teacherID, saltPassword, hashPassword
            FROM TeacherList
            WHERE teacherEmail = ?;
        `;
        const connection = await db.getConnection();
        try {
            const [user] = await connection.query(query, [email]);
            return user;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    async readAllTeachers(departmentID, searchQuery) {
        const query = `
            SELECT
                teacherID,
                firstName,
                lastName,
                teacherEmail,
                contactNumber
            FROM TeacherList
            WHERE departmentID = ?
            AND (
                firstName LIKE CONCAT('%', ?, '%') OR
                lastName LIKE CONCAT('%', ?, '%') OR
                teacherEmail LIKE CONCAT('%', ?, '%') OR
                contactNumber LIKE CONCAT('%', ?, '%')
            );
        `;

        const connection = await db.getConnection();
        
        try {
            const [result] = await db.execute(query, [
                departmentID,
                searchQuery || '',
                searchQuery || '',
                searchQuery || '',
                searchQuery || '',
            ]);
            return result;
        } catch (error) {
            console.error("Error reading teacher list:", error);
            throw error;
        } finally {
            connection.release();
        }
    }

    async readCurrentTeacherSchedule(teacherID) {
        const query = `
            SELECT
                scheduleID,
                dayOfWeek,
                startTime,
                endTime
            FROM WeeklySchedule
            WHERE teacherID = ?;
        `;

        const connection = await db.getConnection();
        try {
            const [result] = await db.execute(query, [teacherID]);
            return result;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            connection.release();
        }
    }

    async readWeeklySchedule(teacherID) {
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

    async readDashboardData(teacherID) {
        const query = `
            SELECT 
                COUNT(*) AS totalAppointments, 
                COUNT(CASE WHEN appointmentStatus = 'Active' THEN 1 END) AS activeAppointments, 
                COUNT(CASE WHEN appointmentStatus = 'Cancelled' THEN 1 END) AS cancelledAppointments,
                COUNT(CASE WHEN appointmentStatus = 'Completed' THEN 1 END) AS completedAppointments,
                COUNT(CASE WHEN appointmentStatus = 'Decline' THEN 1 END) AS declinedAppointments
            FROM AppointmentList 
            WHERE teacherID = ?;
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

    async readTeacher(teacherID) {
        const query = `
            SELECT
                teacherID,
                firstName,
                lastName,
                teacherEmail,
                contactNumber
            FROM TeacherList
            WHERE teacherID = ?;
        `;

        const connection = await db.getConnection();
        
        try {
            const [result] = await db.execute(query, [
                teacherID
            ]);
            return result;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }
}