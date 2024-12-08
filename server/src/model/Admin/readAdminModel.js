import db from '../../config/db/db.js';

export default class AdminModel {
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

    async readAllDepartmentAccount(departmentID, searchQuery) {
        const query = `
            SELECT
                accountID,
                accountUsername,
                CONCAT(firstName, ' ', lastName) AS fullName,
                dateCreated,
                status
            FROM DepartmentAccount
            WHERE departmentID = ?
            AND (
                firstName LIKE CONCAT('%', ?, '%') OR
                lastName LIKE CONCAT('%', ?, '%') OR
                dateCreated LIKE CONCAT('%', ?, '%')
            );
        `;

        const connection = await db.getConnection();
        try {
            const [user] = await connection.query(query, [
                departmentID,
                searchQuery || '',
                searchQuery || '',
                searchQuery || ''
            ]);
            return user;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }
}