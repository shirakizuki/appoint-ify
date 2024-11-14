import db from "../config/db.js"

export default class TeacherController {

    /**
     * Creates a new teacher entry in the TeacherList table.
     * 
     * This method first checks if a teacher with the provided email or contact number already exists.
     * If a conflict is found, an error is thrown. Otherwise, it inserts the new teacher's details
     * including department ID, name, email, contact number, and password hashes into the database.
     * 
     * @param {number} departmentID - The ID of the department the teacher belongs to.
     * @param {string} firstName - The first name of the teacher.
     * @param {string} lastName - The last name of the teacher.
     * @param {string} teacherEmail - The email address of the teacher.
     * @param {string} contactNumber - The contact number of the teacher.
     * @param {string} saltPassword - The salted version of the teacher's password.
     * @param {string} hashPassword - The hashed version of the teacher's password.
     * @throws Will throw an error if the email or contact number already exists in the database.
     * @returns {Promise<number>} The number of rows affected by the insert operation.
     */
    async createTeacher(departmentID, firstName, lastName, teacherEmail, contactNumber, saltPassword, hashPassword) {
        const connection = await db.getConnection();
        try {
            const checkQuery = `
                SELECT 
                    1 
                FROM TeacherList 
                WHERE teacherEmail = ? OR contactNumber = ?;
            `;
            
            const [exists] = await connection.execute(checkQuery, [teacherEmail, contactNumber]);
    
            if (exists.length > 0) {
                throw new Error('Email or contact number already exists.');
            }

            const insertQuery = `
                INSERT INTO TeacherList
                    (departmentID,
                    firstName,
                    lastName,
                    teacherEmail,
                    contactNumber,
                    saltPassword,
                    hashPassword)
                VALUES (?, ?, ?, ?, ?, ?, ?);
            `
            const [result] = await connection.execute(insertQuery, [
                departmentID,
                firstName,
                lastName,
                teacherEmail,
                contactNumber,
                saltPassword,
                hashPassword
            ]);

            return result.affectedRows;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    /**
     * Retrieves the details of a specific teacher from the TeacherList table using their teacher ID.
     *
     * This method fetches the first name, last name, email address, and contact number of the teacher
     * with the given teacher ID. If the query execution fails, an error is logged and thrown.
     *
     * @param {number} teacherID - The ID of the teacher whose information is to be retrieved.
     * @returns {Promise<Object>} An object containing the teacher's first name, last name, email,
     *                            and contact number.
     * @throws Will throw an error if there is an issue with the database query.
     */
    async readSpecificTeacher(teacherID) {
        const query = `
            SELECT 
                firstName, 
                lastName, 
                teacherEmail, 
                contactNumber
            FROM TeacherList
            WHERE teacherID = ?;
        `;

        const connection = await db.getConnection();
        try {
            const [result] = await connection.query(query, [teacherID]);
            return result;
        } catch (error) {
            console.error("Error reading specific teacher:", error);
            throw error;
        } finally {
            connection.release();
        }
    }

    /**
     * Retrieves the salted and hashed password for a specific teacher from the TeacherList table using their teacher ID.
     *
     * This method fetches the saltPassword and hashPassword fields associated with the specified teacher ID.
     * If the query execution fails, an error is thrown.
     *
     * @param {number} teacherID - The ID of the teacher whose password information is to be retrieved.
     * @returns {Promise<Object>} An object containing the saltPassword and hashPassword of the teacher.
     * @throws Will throw an error if there is an issue with the database query.
     */
    async readTeacherPassword(teacherID) {
        const query = `
            SELECT 
                saltPassword, 
                hashPassword
            FROM TeacherList
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

    /**
     * Retrieves the list of all teachers in a specific department from the TeacherList table.
     * 
     * This method fetches the teacherID, firstName, lastName, email address, and contact number
     * of all teachers in the given department. If the query execution fails, an error is thrown.
     * 
     * @param {number} departmentID - The ID of the department whose teacher list is to be retrieved.
     * @returns {Promise<Array<Object>>} An array of objects containing the teacher's details.
     * @throws Will throw an error if there is an issue with the database query.
     */
    async readTeacherList(departmentID) {
        const query = `
            SELECT
                teacherID,
                firstName,
                lastName,
                teacherEmail,
                contactNumber
            FROM TeacherList
            WHERE departmentID = ?;
        `;

        const connection = await db.getConnection();
        try {
            const [result] = await connection.execute(query, [departmentID]);
            return result;
        } catch (error) {
            console.error("Error reading teacher list:", error);
            throw error;
        } finally {
            connection.release();
        }
    }

    /**
     * Updates the details of a specific teacher in the TeacherList table.
     *
     * This method updates the first name, last name, email address, and contact number
     * of the teacher with the given teacher ID. If the update is successful, the 
     * result of the query execution is returned. If the update fails, an error is logged
     * and thrown.
     *
     * @param {number} teacherID - The ID of the teacher whose information is to be updated.
     * @param {string} firstName - The new first name of the teacher.
     * @param {string} lastName - The new last name of the teacher.
     * @param {string} teacherEmail - The new email address of the teacher.
     * @param {string} contactNumber - The new contact number of the teacher.
     * @returns {Promise<Object>} The result of the update operation.
     * @throws Will throw an error if there is an issue with the database query.
     */
    async updateTeacher(teacherID, firstName, lastName, teacherEmail, contactNumber) {
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
            const result = await connection.execute(query, [firstName, lastName, teacherEmail, contactNumber, teacherID]);
            return result;
        } catch (error) {
            console.error("Error updating teacher:", error);
            throw error;
        } finally {
            connection.release();
        }
    }

    /**
     * Updates the password of a specific teacher in the TeacherList table.
     * 
     * This method updates the saltPassword and hashPassword fields of the teacher with the given teacher ID.
     * If the update is successful, the number of rows affected by the update operation is returned.
     * If the update fails, an error is thrown.
     * 
     * @param {number} teacherID - The ID of the teacher whose password is to be updated.
     * @param {string} saltPassword - The salted password of the teacher.
     * @param {string} hashPassword - The hashed password of the teacher.
     * @returns {Promise<number>} The number of rows affected by the update operation.
     * @throws Will throw an error if there is an issue with the database query.
     */
    async updateTeacherPassword(teacherID, saltPassword, hashPassword) {
        const query = `
            UPDATE TeacherList 
            SET 
                saltPassword = ?, 
                hashPassword = ?
            WHERE teacherID = ?;
        `;
        
        const connection = await db.getConnection();
        try {
            const [result] = await connection.execute(query, [saltPassword, hashPassword, teacherID]);
            return result.affectedRows;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    /**
     * Deletes a specific teacher from the TeacherList table using their teacher ID.
     *
     * This method removes the teacher entry with the given teacher ID from the database.
     * If the deletion operation is successful, the result of the query is returned.
     * If the deletion fails, an error is logged and thrown.
     *
     * @param {number} teacherID - The ID of the teacher to be deleted.
     * @returns {Promise<Object>} The result of the delete operation.
     * @throws Will throw an error if there is an issue with the database query.
     */
    async deleteTeacher(teacherID) {
        const query = `
            DELETE 
            FROM TeacherList 
            WHERE teacherID = ?;
        `;

        const connection = await db.getConnection();
        try {
            const result = await connection.execute(query, [teacherID]);
            return result;
        } catch (error) {
            console.error("Error updating teacher:", error);
            throw error;
        } finally {
            connection.release();
        }
    }
}