import jwt from 'jsonwebtoken'
import LoginController from '../../controllers/LoginController.js'

import { validatePassword } from '../../config/Validator/PasswordValidator.js'

const loginController = new LoginController()

/**
 * Handles the login process for a teacher account.
 * 
 * Validates the request body for email and password, retrieves the teacher account, 
 * checks password validity, and generates JWT tokens. If successful, responds with 
 * a token and sets a refresh token cookie. Handles errors appropriately.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} req.body - The body of the request, containing email and password.
 * @param {string} req.body.email - The email of the teacher account.
 * @param {string} req.body.password - The password of the teacher account.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} - A promise that resolves with the appropriate HTTP response.
 */
const teacherLogin = async (req, res) => {
    const {email, password} = req.body;

    if(!(email && password)) {
        return res.status(400).json({message: 'Please enter both email and password'});
    }

    try {
        const user = await loginController.getTeacherAccount(email);
        if (!user || !Array.isArray(user) || user.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid login credentials. User not found'
            });
        }

        if(!(await validatePassword(user, password))) {
            return res.status(401).json({
                success: false,
                message: 'Password did not match with our system.'
            });
        }

        const token = jwt.sign({
            teacherID: user[0].teacherID,
        }, process.env.JWT_SECRET, {
            expiresIn: '2h'
        });

        const refreshToken = jwt.sign({
            teacherID: user[0].teacherID,
        }, process.env.JWT_SECRET, {
            expiresIn: '1d'
        });

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            success: true,
            teacherID: user[0].teacherID,
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}

export default teacherLogin