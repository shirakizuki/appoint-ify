import TeacherController from '../../models/TeacherController.js';
import verifyToken from '../../helpers/validateToken.js';
import asyncHandler from 'express-async-handler'

const teacherController = new TeacherController();

/**
 * Middleware to load a list of teachers from the TeacherList table based on the provided department ID.
 * Verifies JWT token before proceeding with the retrieval.
 * Sends the retrieved list as a JSON response if successful, otherwise sends an error response.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} req.query - The query parameters of the request.
 * @param {number} req.query.departmentID - The ID of the department to retrieve the teacher list for.
 * @param {Object} res - The Express response object.
 */
const loadTeacherList = [verifyToken, asyncHandler(async (req, res) => {
    const { departmentID } = req.query;

    if (!departmentID) {
        return res.status(400).json({ message: 'DepartmentID Name does not exists.' });
    }

    const response = await teacherController.readTeacherList(departmentID).catch(error => {
        console.error(error);
        throw error;
    });

    res.status(200).json({ teacherList: response });
})]

/**
 * Loads a list of teachers from the TeacherList table based on the provided department ID.
 * This middleware verifies the JWT token and then calls the TeacherController to retrieve the list of teachers.
 * If the query is successful, the response is sent back as JSON.
 * If there is an error with the query, the error is caught and an Internal Server Error response is sent back.
 * @function
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * @example
 * // To call this middleware function
 * router.get('/teacherlist', loadTeacherList);
 */
const loadSpecificTeacher = [verifyToken, asyncHandler(async (req, res) => {
    const {teacherID} = req.query;
    if(!teacherID) {
        return res.status(400).json({ status: false, message: 'Teacher ID does not exists.' });
    }

    const resposne = await teacherController.readSpecificTeacher(teacherID).catch(error => {
        console.error(error);
        throw error;
    });
    
    res.status(200).json({ status: true, teacher: resposne });
})]

export default {loadTeacherList, loadSpecificTeacher}