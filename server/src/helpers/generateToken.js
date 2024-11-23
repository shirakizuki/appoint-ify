import jwt from "jsonwebtoken";

/**
 * Generates a JWT token that represents the given user ID.
 * @function
 * @param {string} id The user ID to be signed into the token.
 * @returns {string} The signed JWT token.
 */
const generateToken = (id) => {
    // token must be returned to the client
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

export default generateToken;