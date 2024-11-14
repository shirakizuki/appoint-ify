import {validatePassword, generateSalt, createSaltedHash} from '../../config/Validator/PasswordValidator.js';
import TeacherController from '../../controllers/TeacherController.js';
import verifyToken from '../../config/Tokenizer/Tokenizer.js';

const teacherController = new TeacherController()

/**
 * Handles the PUT request to update a specific teacher's information.
 * 
 * This method expects the teacher ID, first name, last name, email address, and contact number
 * in the request body. If any of the fields are missing, a 400 status code is returned.
 * If the update is successful, a 201 status code is returned with a success message. If the update
 * fails, a 500 status code is returned with an error message.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 * @throws {Error} If there is an issue with the database query.
 */
const updateSpecificTeacher = [verifyToken, async (req, res) => {
    const { teacherID, firstName, lastName, teacherEmail, contactNumber } = req.body;

    if (!teacherID || !firstName || !lastName || !teacherEmail || !contactNumber) {
        return res.status(400).json({ status: false, message: 'Request body is empty.' });
    }

    try {
        await teacherController.updateTeacher(teacherID, firstName, lastName, teacherEmail, contactNumber );
        res.status(201).json({ status: true, message: 'Teacher updated successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
}]

/**
 * Handles the PUT request to update a specific teacher's password.
 * 
 * This method expects the teacher ID, current password, new password, and confirm password
 * in the request body. If any of the fields are missing, a 400 status code is returned.
 * If the current password does not match the password in the database, a 401 status code is
 * returned. If the new password and confirm password do not match, a 400 status code is returned.
 * If the update is successful, a 200 status code is returned with a success message. If the update
 * fails, a 500 status code is returned with an error message.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 * @throws {Error} If there is an issue with the database query.
 */
const updateTeacherPassword = [verifyToken, async (req, res) => {
    const {teacherID, currentPassword, newPassword, confirmPassword} = req.body;
    if(!(teacherID && currentPassword && newPassword && confirmPassword)) {
        return res.status(400).json({
            status: false,
            message: 'Please enter all fields'
        });
    }

    if(newPassword !== confirmPassword) {
        return res.status(400).json({
            status: false,
            message: 'Passwords do not match'
        });
    }

    try {
        const result = await teacherController.readTeacherPassword(teacherID);
        if(!(await validatePassword(result, currentPassword))) {
            return res.status(401).json({
                status: false,
                message: 'Password did not match with our system.'
            });
        }
        const newSalt = generateSalt(16);
        const newHash = createSaltedHash(newPassword, newSalt);
        const newResult = await teacherController.updateTeacherPassword(teacherID, newSalt, newHash)
        if(newResult) {
            return res.status(200).json({
                status: true,
                message: 'Password updated successfully'
            });
        } else {
            return res.status(400).json({
                status: false,
                message: 'Failed to update password'
            });
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ 
            status: false,
            error: 'Internal Server Error'
        });
    }
}]

export default {updateSpecificTeacher, updateTeacherPassword}