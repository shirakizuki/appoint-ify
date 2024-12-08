import asyncHandler from 'express-async-handler';
import { verifyToken } from '../../helper/tokenChecker.js';
import AppointmentModel from '../../model/Appointment/readAppointmentModel.js';

const appointmentModel = new AppointmentModel();

export const readAllAppointments = [verifyToken, asyncHandler(async (req, res) => {
    const { departmentID, searchQuery } = req.query;

    if (!departmentID) {
        return res.status(400).json({ message: 'Request body is empty.' });
    }

    const result = await appointmentModel.readAllAppointments(departmentID, searchQuery);

    return res.status(200).json({ 
        appointmentList:result 
    });
    
})]

export const readFilterAppointment = [verifyToken, asyncHandler(async (req, res) => {
    const { departmentID, from, to, status } = req.query;
    
    const result = await appointmentModel.readFilterAppointment(departmentID, from, to, status);

    return res.status(200).json({ 
        appointmentList:result 
    });
})]

export const readDepartmentList = asyncHandler(async (req, res) => {
    const result = await appointmentModel.readDepartmentList();
    
    return res.status(200).json({ 
        departmentList:result 
    });
})

export const readTeacherList = asyncHandler(async (req, res) => {
    const { departmentID } = req.query;

    if (!departmentID) {
        return res.status(400).json({ message: 'Request body is empty.' });
    }

    const result = await appointmentModel.readTeacherList(departmentID);
    
    return res.status(200).json({ 
        teacherList:result 
    });
})

export const readScheduleSlot = asyncHandler(async (req, res) => {
    const { inputDate, teacherID } = req.query;

    if (!inputDate || !teacherID) {
        return res.status(400).json({ message: 'Request body is empty.' });
    }

    const result = await appointmentModel.readScheduleSlot(inputDate, teacherID);

    return res.status(200).json({ 
        result 
    });
})

export const readDurationLimiter = asyncHandler(async (req, res) => {
    const { scheduleID, selectedDate } = req.query;

    if (!scheduleID && !selectedDate) {
        return res.status(400).json({ message: 'Request body is empty.' });
    }

    const ddate = new Date(selectedDate);
    const year = ddate.getFullYear();
    const month = String(ddate.getMonth() + 1).padStart(2, '0');
    const day = String(ddate.getDate()).padStart(2, '0');
    const hours = String(ddate.getHours()).padStart(2, '0');
    const minutes = String(ddate.getMinutes()).padStart(2, '0');
    const seconds = String(ddate.getSeconds()).padStart(2, '0');
    const newDate = `${year}-${month}-${day}-${hours}:${minutes}:${seconds}`;

    const result = await appointmentModel.readDurationLimiter(scheduleID, newDate);

    return res.status(200).json({ 
        result 
    });
})

export const readTeacherAppointments = [verifyToken, asyncHandler(async (req, res) => {
    const { teacherID } = req.query;

    if (!teacherID) {
        return res.status(400).json({ message: 'Request body is empty.' });
    }

    const result = await appointmentModel.readTeacherAppointments(teacherID);

    return res.status(200).json({ 
        result 
    });
})]
