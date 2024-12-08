import asyncHandler from 'express-async-handler';
import { verifyToken } from '../../helper/tokenChecker.js';
import AppointmentModel from '../../model/Appointment/updateAppointmentModel.js';

const appointmentModel = new AppointmentModel();

// Values for the appointmentStatus = 'Cancelled', 'Completed', 'Active', 'Decline'
export const updateAppointment = [verifyToken, asyncHandler(async (req, res) => {
    const { appointmentID, appointmentStatus, cancelReason } = req.body;

    if (!(appointmentID && appointmentStatus)) {
        return res.status(400).json({ message: 'Request body is empty.' });
    }

    const result = await appointmentModel.updateAppointmentStatus(appointmentID, appointmentStatus, cancelReason);

    if(result) {
        return res.status(200).json({
            message: 'Appointment status was updated successfully.'
        });
    }
})]