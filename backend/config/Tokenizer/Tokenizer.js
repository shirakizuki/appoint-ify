import jwt from 'jsonwebtoken';

/**
 * Middleware function to verify JWT from the Authorization header.
 * 
 * This function checks for the presence of a token in the Authorization
 * header of the incoming request. If a token is found, it is verified 
 * against the secret stored in the environment variable `JWT_SECRET`.
 * If the token is valid, it decodes the token and attaches the decoded 
 * information to the `req.user` object. If the token is missing or invalid,
 * it responds with a 401 status and an appropriate error message.
 * 
 * @param {Object} req - The request object from the client, which should contain an 'authorization' header with a Bearer token.
 * @param {Object} res - The response object used to send back the desired HTTP response.
 * @param {Function} next - The next middleware function in the stack to be executed.
 */
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ status: 'fail', message: 'No token provided' });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ status: 'fail', message: 'Invalid or expired token' });
        }
        req.user = decoded;
        next();
    });
}

export default verifyToken;
