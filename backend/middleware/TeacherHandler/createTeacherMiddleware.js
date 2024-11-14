import TeacherController from '../../controllers/TeacherController.js'
import verifyToken from '../../config/Tokenizer/Tokenizer.js'
import { validateForm } from '../../config/FormValidator/TeacherFormValidator.js'
import { generateSalt, createSaltedHash } from '../../config/Validator/PasswordValidator.js'

const teacherController = new TeacherController()

/**
 * @description Handles the POST request to create a teacher.
 * @memberof TeacherHandler
 * @function createTeacher
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 * @throws {Error} If there is an issue with the database query.
 */
const createTeacher = [verifyToken, async (req, res) => {
    const { departmentID, firstName, lastName, teacherEmail, contactNumber, teacherPassword, teacherConfirmPassword } = req.body;

    if (!(departmentID && firstName && lastName && teacherEmail && contactNumber && teacherPassword && teacherConfirmPassword)) {
        return res.status(400).json({ status: false, message: 'Request body is empty.' });
    }

    const errors = validateForm(req.body);

    if (errors) {
        return res.status(400).json({
            status: false,
            message: 'Please check credentials.',
            errors: errors
        });
    }

    const generatedSalt = generateSalt(16);
    const hashPassword = createSaltedHash(teacherPassword, generatedSalt);

    try {
        const affectedRows = await teacherController.createTeacher(departmentID, firstName, lastName, teacherEmail, contactNumber, generatedSalt, hashPassword);

        if (affectedRows === 0) {
            return res.status(400).json({
                status: false,
                message: 'Failed to create teacher, no rows affected.'
            });
        }

        return res.status(201).json({
            status: true,
            message: 'Teacher created successfully.'
        });

    } catch (error) {
        console.error(error);

        if (error.message === 'Email or contact number already exists.') {
            return res.status(400).json({
                status: false,
                message: error.message
            });
        }

        return res.status(500).json({
            status: false,
            message: 'Internal Server Error'
        });
    }
}];

export default createTeacher