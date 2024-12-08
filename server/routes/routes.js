import express from 'express'

import { teacherLogin, readAllTeachers, readCurrentTeacherSchedule, readWeeklySchedule, readDashboardData, readTeacher  } from '../src/middleware/Teacher/readMiddleware.js';
import { deleteTeacher } from '../src/middleware/Teacher/deleteMiddleware.js';
import { createTeacher } from '../src/middleware/Teacher/createMiddleware.js';

import { adminLogin, getAllDepartmentAccount } from '../src/middleware/Admin/readAdminAccount.js';
import { createAdmin } from '../src/middleware/Admin/createAdminAccount.js';
import { deleteAdminAccount } from '../src/middleware/Admin/deleteAdminAccount.js';

import { readAllAppointments, readDepartmentList, readFilterAppointment, readTeacherList, readScheduleSlot, readDurationLimiter, readTeacherAppointments } from '../src/middleware/Appointment/readMiddleware.js';
import { createAppointment } from '../src/middleware/Appointment/createMiddleware.js';
import { updateAppointment } from '../src/middleware/Appointment/updateMiddleware.js';

import { updateWeeklySchedule, updateTeacherPassword, updateTeacherInfo } from '../src/middleware/Teacher/updateMiddleware.js';

import { sendApprove, sendOneTimePin, sendSuccess, sendDecline, sendCancelled } from '../src/middleware/Email/createMiddleware.js';
import { validateOTP } from '../src/util/otpHandler.js';

const router = express.Router();

// BASE ROUTES
router.post('/login/teacher', teacherLogin);
router.post('/login/admin', adminLogin);

// APPOINTMENT ROUTES
router.get('/read/all/current/appointment', readAllAppointments);
router.get('/read/filter/current/appointment', readFilterAppointment);
router.get('/read/appointment/all/departments', readDepartmentList);
router.get('/read/appointment/current/department/teachers', readTeacherList);
router.get('/read/appointment/current/teacher/schedule', readScheduleSlot);
router.get('/read/appointment/current/schedule/avilable-duration', readDurationLimiter);
router.post('/create/appointment', createAppointment);
router.patch('/update/current/appointment/status', updateAppointment);


// TEACHER ROUTES
router.get('/read/current/teacher/dashboard', readDashboardData)
router.post('/create/teacher', createTeacher);
router.get('/read/current/teacher/appointment', readTeacherAppointments);
router.post('/create/current/teacher/schedule', updateWeeklySchedule)
router.get('/read/all/teachers', readAllTeachers);
router.get('/read/current/teacher', readTeacher);
router.get('/read/current/teacher/schedule', readCurrentTeacherSchedule);
router.get('/read/current/teacher/weeklyschedule', readWeeklySchedule);
router.delete('/delete/current/teacher', deleteTeacher);
router.patch('/update/current/teacher/info', updateTeacherInfo);
router.patch('/update/current/teacher/password', updateTeacherPassword);

// EMAIL ROUTES
router.post('/send/email/otp', sendOneTimePin);
router.post('/send/email/success', sendSuccess);
router.post('/send/email/approve', sendApprove);
router.post('/send/email/decline', sendDecline);
router.post('/send/email/cancelled', sendCancelled);
router.post('/send/email/verify', validateOTP);

// ADMIN ROUTES
router.get('/read/all/accounts', getAllDepartmentAccount);
router.post('/create/admin/account', createAdmin);
router.delete('/delete/current/account', deleteAdminAccount);

export default router;