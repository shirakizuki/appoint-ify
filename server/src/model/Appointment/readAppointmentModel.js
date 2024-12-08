import db from '../../config/db/db.js';

export default class AppointmentModel {
    async readAllAppointments(departmentID, searchQuery) {
        const query = `
            SELECT 
                al.appointmentID,
                al.departmentID,
                al.teacherID,
                CONVERT_TZ(appointmentDate, '+00:00', '+08:00') as appointmentDate,
                al.scheduleID,
                al.referenceCode,
                al.appointmentPurpose,
                al.appointmentDuration,
                al.appointmentStatus,
                al.cancelReason,
                sc.startTime,
                sc.endTime,
                tl.firstName AS teacherFirstName,
                tl.lastName AS teacherLastName,
                si.firstName AS studentFirstName,
                si.lastName AS studentLastName,
                si.email,
                si.phoneNumber,
                si.course,
                si.currentYear,
                si.studentID
            FROM AppointmentList al
            INNER JOIN StudentInformation si
                ON al.appointmentID = si.appointmentID
            INNER JOIN WeeklySchedule sc
                ON al.scheduleID = sc.scheduleID
            INNER JOIN TeacherList tl
                ON al.teacherID = tl.teacherID
            WHERE al.departmentID = ?
            AND (
                tl.firstName LIKE CONCAT('%', ?, '%') OR
                tl.lastName LIKE CONCAT('%', ?, '%') OR
                si.firstName LIKE CONCAT('%', ?, '%') OR
                si.lastName LIKE CONCAT('%', ?, '%')
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
            console.error(error);
            throw error;
        } finally {
            connection.release();
        }
    }

    async readFilterAppointment(departmentID, from, to, status) {
        const query = `
            SELECT 
                al.appointmentID,
                al.departmentID,
                al.teacherID,
                CONVERT_TZ(appointmentDate, '+00:00', '+08:00') as appointmentDate,
                al.scheduleID,
                al.referenceCode,
                al.appointmentPurpose,
                al.appointmentDuration,
                al.appointmentStatus,
                al.cancelReason,
                sc.startTime,
                sc.endTime,
                tl.firstName AS teacherFirstName,
                tl.lastName AS teacherLastName,
                si.firstName AS studentFirstName,
                si.lastName AS studentLastName,
                si.email,
                si.phoneNumber,
                si.course,
                si.currentYear,
                si.studentID
            FROM AppointmentList al
            INNER JOIN StudentInformation si
                ON al.appointmentID = si.appointmentID
            INNER JOIN WeeklySchedule sc
                ON al.scheduleID = sc.scheduleID
            INNER JOIN TeacherList tl
                ON al.teacherID = tl.teacherID
            WHERE al.departmentID = ?
            AND (
                (al.appointmentDate BETWEEN ? AND ?)
                OR ? = ''
            )
            AND (
                al.appointmentStatus LIKE CONCAT('%', ?, '%')
                OR ? = ''
            );
        `;
        const connection = await db.getConnection();
        try {
            const [result] = await db.execute(query, [
                departmentID,
                from || '1900-01-01',
                to || '2100-01-01',
                from || '',
                status || '',
                status || ''
            ]);
            return result;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            connection.release();
        }
    }

    async readDepartmentList() {
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

    async readTeacherAppointments(teacherID) {
        const query = `
            SELECT 
                al.appointmentID,
                CONVERT_TZ(appointmentDate, '+00:00', '+08:00') as appointmentDate,
                al.scheduleID,
                al.referenceCode,
                al.appointmentPurpose,
                al.appointmentDuration,
                al.appointmentStatus,
                al.cancelReason,
                sc.startTime,
                sc.endTime,
                si.firstName AS studentFirstName,
                si.lastName AS studentLastName,
                si.email,
                si.phoneNumber,
                si.course,
                si.currentYear,
                si.studentID
            FROM AppointmentList al
            INNER JOIN StudentInformation si
                ON al.appointmentID = si.appointmentID
            INNER JOIN WeeklySchedule sc
                ON al.scheduleID = sc.scheduleID
            WHERE al.teacherID = ?
            AND (al.appointmentStatus = 'Completed' OR al.appointmentStatus = 'Active');
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
}