import db from '../db/db.js';

export default class AuthController {

    /**
     * Retrieves the department account information from the DepartmentAccount table by username.
     * 
     * @param {string} username - The username of the department to retrieve.
     * @returns {Promise<Object>} An object containing the department's ID, salted password, and hashed password.
     * @throws Will throw an error if there is an issue with the database query.
     */
    async getDepartmentAccount(username) {
        const query = `
            SELECT 
                accountID, departmentID, saltPassword, hashPassword 
            FROM DepartmentAccount
            WHERE accountUsername = ?;
        `;
        const connection = await db.getConnection();
        try {
            const [user] = await connection.query(query, [username]);
            return user;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }
    /**
     * Retrieves the teacher account information from the TeacherList table by email.
     * 
     * @param {string} email - The email address of the teacher to retrieve.
     * @returns {Promise<Object>} An object containing the teacher's ID, salted password, and hashed password.
     * @throws Will throw an error if there is an issue with the database query.
     */
    async getTeacherAccount(email) {
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
}