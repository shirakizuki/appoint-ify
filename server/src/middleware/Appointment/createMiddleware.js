import AppointmentModel from "../../model/Appointment/createAppointmentModel.js";
import { generateRefCode } from "../../util/generatorHandler.js";
import asyncHandler from "express-async-handler";

const appointmentModel = new AppointmentModel();

export const createAppointment = asyncHandler(async (req, res) => {
    const { 
        departmentID, 
        teacherID, 
        appointmentDate, 
        scheduleID,
        appointmentPurpose,
        appointmentDuration,
        firstName,
        lastName,
        email,
        phoneNumber,
        course,
        currentYear,
        studentID } = req.body;

    if(!req.body) {
        return res.status(400).json({ message: 'Request body is empty.' });
    }

    const referenceCode = generateRefCode();
    const result = await appointmentModel.createAppointment(
        departmentID,
        teacherID, 
        appointmentDate, 
        scheduleID,
        referenceCode,
        appointmentPurpose,
        appointmentDuration,
        firstName,
        lastName,
        email,
        phoneNumber,
        course,
        currentYear,
        studentID);
    if(result) {
        return res.status(201).json({
            message: 'Appointment was created successfully.',
            referenceCode: referenceCode
        });
    }
})