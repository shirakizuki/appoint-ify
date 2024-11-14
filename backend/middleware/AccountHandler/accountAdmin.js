import jwt from 'jsonwebtoken'
import LoginController from '../../controllers/LoginController.js'

import { validatePassword } from '../../config/Validator/PasswordValidator.js'

const loginController = new LoginController()

/**
 * Handles the login process for a department account.
 * 
 * This function validates the request body for username and password, retrieves the department account, 
 * checks password validity, and generates JWT tokens. If successful, it responds with a token and sets a 
 * refresh token cookie. Handles errors appropriately.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} req.body - The body of the request, containing username and password.
 * @param {string} req.body.username - The username of the department account.
 * @param {string} req.body.password - The password of the department account.
 * @param {Object} res - The Express response object.
 * @returns {Promise<void>} - A promise that resolves with the appropriate HTTP response.
 */
const departmentLogin = async (req, res) => {
    const {username, password} = req.body;

    if(!(username && password)) {
        return res.status(400).json({message: 'Please enter both username and password'});
    }

    try {
        const user = await loginController.getDepartmentAccount(username);
        if (!user || !Array.isArray(user) || user.length === 0) {
            return res.status(401).json({
                status: false,
                message: 'Invalid login credentials. User not found'
            });
        }

        if(!(await validatePassword(user, password))) {
            return res.status(401).json({
                status: false,
                message: 'Password did not match with our system.'
            });
        }

        const token = jwt.sign({
            departmentID: user[0].departmentID,
        }, process.env.JWT_SECRET, {
            expiresIn: '2h'
        });

        const refreshToken = jwt.sign({
            departmentID: user[0].departmentID,
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
            status: true,
            departmentID: user[0].departmentID,
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, error: 'Internal Server Error' });
    }
}

export default departmentLogin