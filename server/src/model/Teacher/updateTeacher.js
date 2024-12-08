import db from '../../config/db/db.js';

export default class UpdateModel {
    async updateTeacherPassword(saltPassword, hashPassword, teacherID) {
        const query = `
            UPDATE TeacherList
            SET
                saltPassword = ?,
                hashPassword = ?
            WHERE teacherID = ?;
        `;
        const connection = await db.getConnection();
        try {
            const [result] = await connection.query(query, [saltPassword, hashPassword, teacherID]);
            return result;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    async updateTeacherInfo(teacherID, firstName, lastName, teacherEmail, contactNumber) {
        const query = `
            UPDATE TeacherList
            SET
                firstName = ?,
                lastName = ?,
                teacherEmail = ?,
                contactNumber = ?
            WHERE teacherID = ?;
        `;
        const connection = await db.getConnection();
        try {
            const [result] = await connection.query(query, [firstName, lastName, teacherEmail, contactNumber, teacherID]);
            return result;
        } catch (error) {
            throw error;            
        } finally {
            connection.release();
        }
    }

    async updatePassword(teacherID) {
        const query = `
            SELECT
                saltPassword, hashPassword
            FROM TeacherList
            WHERE teacherID = ?;
        `;
        const connection = await db.getConnection();
        try {
            const [user] = await connection.query(query, [teacherID]);
            return user[0];
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }
}