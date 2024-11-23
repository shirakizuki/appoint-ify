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

    async createAppointment(formData) {
        const query = `CALL CreateAppointment(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);`;
        const connection = await db.getConnection();
        try {
            const [result] = await connection.execute(query, [
                formData.teacherID
            ]);
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    async readAppointmentList(departmentID) {
        const query = `
            SELECT 
                ap.*,
                we.startTime,
                we.endTime,
                CONCAT(tl.firstName, ' ', tl.lastName) AS teacherName
            FROM AppointmentList ap
            LEFT JOIN WeeklySchedule we
                ON we.scheduleID = ap.scheduleID
            LEFT JOIN TeacherList tl
                ON tl.teacherID = ap.teacherID
            WHERE ap.departmentID = ?;
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

    async readStudentAppointment(appointmentID) {
        const query = `
            SELECT
                *
            FROM StudentInformation
            WHERE appointmentID = ?;
        `;
        const connection = await db.getConnection();
        try {
            const [result] = await connection.execute(query, [appointmentID]);
            return result;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }
}