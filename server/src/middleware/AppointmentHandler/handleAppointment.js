import AppointmentController from '../../models/AppointmentController.js'
import asyncHandler from 'express-async-handler'

const appointmentController = new AppointmentController();

const readDepartmentList = asyncHandler(async (req, res) => {
    const departmentList = await appointmentController.getDepartmentList();
    res.status(200).json({ success: true, departmentList: departmentList });
});

const readTeacherList = asyncHandler(async (req, res) => {
    const { departmentID } = req.query;
    const teacherList = await appointmentController.readTeacherList(departmentID);
    res.status(200).json({ success: true, teacherList: teacherList });
});

const readScheduleSlot = asyncHandler(async (req, res) => {
    const { teacherID, inputDate } = req.query
    const formattedDate = new Date(inputDate);
    if (isNaN(formattedDate.getTime())) {
        return res.status(400).json({ message: 'Invalid date format' });
    }
    const result = await appointmentController.readScheduleSlot(formattedDate.toISOString().slice(0, 10), teacherID);
    res.status(200).json({ success: true, scheduleSlot: result });
});

const readDurationLimiter = asyncHandler(async (req, res) => {
    const {scheduleID, selectedDate} = req.query;

    if(!scheduleID || !selectedDate) {
        return res.status(400).json({ message: 'Schedule ID and selected date are required' });
    }

    const result = await appointmentController.readDurationLimiter(scheduleID, selectedDate);
    res.status(200).json({ success: true, result });
});

const readAllAppointments = asyncHandler(async (req, res) => {
    const { departmentID } = req.query;
    if(!departmentID) {
        return res.status(400).json({ message: 'Department ID is required' });
    }
    const result = await appointmentController.readAppointmentList(departmentID);
    res.status(200).json({ result });
})

const readSpecificAppointment = asyncHandler(async (req, res) => {
    const { appointmentID } = req.query;
    if(!appointmentID) {
        return res.status(400).json({ message: 'Appointment ID is required' });
    }
    const result = await appointmentController.readStudentAppointment(appointmentID);
    res.status(200).json({ result });
})

export default {
    readDepartmentList,
    readTeacherList,
    readScheduleSlot,
    readDurationLimiter,
    readAllAppointments,
    readSpecificAppointment,
}