import express from 'express';

import teacherLogin from '../src/middleware/AccountHandler/teacherAccount.js';
import departmentLogin from '../src/middleware/AccountHandler/adminAccount.js';
import readTeacherMiddleware from '../src/middleware/TeacherHandler/readTeacherMiddleware.js';
import createTeacher from '../src/middleware/TeacherHandler/createTeacherMiddleware.js';
import updateTeacherMiddleware from '../src/middleware/TeacherHandler/updateTeacherMiddleware.js';
import readWeeklySchedule from '../src/middleware/ScheduleHandler/readScheduleMiddleware.js';
import updateWeeklySchedule from '../src/middleware/ScheduleHandler/updateScheduleMiddleware.js';
import handleAppointment from '../src/middleware/AppointmentHandler/handleAppointment.js';
import emailHandler from '../src/middleware/EmailHandler/EmailHandler.js';
import { validateOTP } from '../src/services/otpServices.js';

const router = express.Router();

// GET --> RETRIEVE RESOURCE
// POST --> CREATE NEW RESOURCE
// DELETE --> DELETE RESOURCE
// PUT --> UPDATE RESOURCE
// PATCH --> SPECIFIC UPDATE RESOURCE

router.post('/teacher/login', teacherLogin);
router.post('/admin/login', departmentLogin);
router.post('/createteacher', createTeacher)
router.post('/appointment/sendotp', emailHandler.sendOneTimePin);
router.post('/appointment/success', emailHandler.sendSuccess);
router.post('/appointment/approve', emailHandler.sendApprove);
router.post('/appointment/decline', emailHandler.sendDecline);
router.post('/appointment/verifyotp', validateOTP);
router.post('/appointment/createappointment', handleAppointment.createAppointment);

router.put('/updateteacherinformation', updateTeacherMiddleware.updateSpecificTeacher);
router.put('/updateteacherpassword', updateTeacherMiddleware.updateTeacherPassword);
router.put('/updateweeklyschedule', updateWeeklySchedule);

router.patch('/approveappointment', handleAppointment.approveAppointment);
router.patch('/declineappointment', handleAppointment.declineAppointment);

router.get('/appointment/departmentlist', handleAppointment.readDepartmentList);
router.get('/appointment/teacherlist', handleAppointment.readTeacherList);
router.get('/appointment/schedulelist', handleAppointment.readScheduleSlot);
router.get('/appointment/durationfunc', handleAppointment.readDurationLimiter);
router.get('/loadappointmentlist', handleAppointment.readAllAppointments);
router.get('/loadstudentappointment', handleAppointment.readSpecificAppointment);
router.get('/loadweeklyschedule', readWeeklySchedule);
router.get('/loadteacher', readTeacherMiddleware.loadSpecificTeacher);
router.get('/loadteacherlist', readTeacherMiddleware.loadTeacherList);

export default router;