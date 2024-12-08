import db from '../../config/db/db.js';

export default class AdminModel {
    async createAdmin(departmentID, accountUsername, saltPassword, hashPassword, firstName, lastName) {
        const connection = await db.getConnection();
        const query = `
            INSERT INTO 
                DepartmentAccount (departmentID, accountUsername, saltPassword, hashPassword, firstName, lastName)
            VALUES
                (?, ?, ?, ?, ?, ?);
        `;
        try {

            const [result] = await connection.execute(query,
                [departmentID, accountUsername, saltPassword, hashPassword, firstName, lastName]
            );
            return result;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }
}