import db from '../../config/db/db.js';

export default class AppointmentModel {
    async updateAppointmentStatus(appointmentID, appointmentStatus, cancelReason = null) {
        const connection = await db.getConnection();
        let query = `
            UPDATE AppointmentList
            SET appointmentStatus = ?
            WHERE appointmentID = ?
        `;
        const params = [appointmentStatus, appointmentID];
    
        if (cancelReason) {
            query = `
                UPDATE AppointmentList
                SET appointmentStatus = ?, cancelReason = ?
                WHERE appointmentID = ?
            `;
            params.splice(1, 0, cancelReason);
        }
    
        try {
            await connection.execute(query, params);
            return true;
        } catch (error) {
            throw error;
        } finally {
            connection.release();
        }
    }

    
}