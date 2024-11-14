// IMPORT LIBRARY
import express from 'express';

import teacherLogin from '../middleware/AccountHandler/accountTeacher.js'; 
import adminLogin from '../middleware/AccountHandler/accountAdmin.js'
import readTeacherMiddleware from '../middleware/TeacherHandler/readTeacherMiddleware.js';
import createTeacher from '../middleware/TeacherHandler/createTeacherMiddleware.js';
import updateTeacherMiddleware from '../middleware/TeacherHandler/updateTeacherMiddleware.js';
import readWeeklySchedule from '../middleware/ScheduleHandler/readScheduleMiddleware.js';
import updateWeeklySchedule from '../middleware/ScheduleHandler/updateScheduleMiddleware.js';
import generatePrimary from '../middleware/UniqueIdentificationHandler/primaryGenerator.js';
const router = express.Router();

// POST = RETRIEVAL
// GET = QUERY
// PUT = UPDATE

router.post('/teacher/login', teacherLogin);
router.post('/admin/login', adminLogin);
router.get('/loadteacher', readTeacherMiddleware.loadSpecificTeacher);
router.get('/loadteacherlist', readTeacherMiddleware.loadTeacherList);
router.post('/createteacher', createTeacher)
router.put('/updateteacherinformation', updateTeacherMiddleware.updateSpecificTeacher);
router.put('/updateteacherpassword', updateTeacherMiddleware.updateTeacherPassword);
router.get('/loadweeklyschedule', readWeeklySchedule);
router.put('/updateweeklyschedule', updateWeeklySchedule);
router.get('/generateprimary', generatePrimary);
export default router;