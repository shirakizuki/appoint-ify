import db from '../../config/db/db.js';

export default class AdminModel {
    async deleteAdminAccount(accountID, departmentID) {
        const connection = await db.getConnection();

        const countquery = `
            SELECT
                COUNT(*) as count
            FROM DepartmentAccount
            WHERE departmentID = ?;
        `;
        const delquery = `
            DELETE FROM DepartmentAccount
            WHERE accountID = ? AND departmentID = ?;
        `;
        try {
            const [value] = await db.execute(countquery, [departmentID]);
            const count = value[0].count || 0;
            if (count > 1) {
                const [result] = await connection.execute(delquery, [accountID, departmentID]);
                return result;
            } else {
                return false;
            }
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }
}