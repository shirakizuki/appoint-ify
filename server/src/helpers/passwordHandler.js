import crypto from 'crypto';

export const generateSalt = (length) => crypto.randomBytes(length).toString('hex');

/**
 * Combines the given password and salt and then hashes the result using the sha256 algorithm.
 * @param {string} password - The password to hash.
 * @param {string} salt - The salt to use in the hashing process.
 * @returns {string} The hashed password.
 */
const hashPasswordWithSalt = (password, salt) => {
    const combined = password + salt;
    return crypto.createHash('sha256').update(combined).digest('hex');
};

/**
 * Creates a salted and hashed password from the given password and salt.
 * The hashing process is done 3 times, and the result is the final hashed password.
 * @param {string} password - The password to be hashed.
 * @param {string} salt - The salt to use for hashing.
 * @returns {string} The salted and hashed password.
 */
export const createSaltedHash = (password, salt) => {
    for (let i = 0; i < 3; i++) {
        salt = hashPasswordWithSalt(salt, salt);
    }
    return hashPasswordWithSalt(password, salt);
};

/**
 * Validates a user's password by comparing it with the stored hashed password.
 *
 * This function computes a hash using the provided password and the user's stored salt.
 * The hashing process is iterated three times to increase security.
 * It then compares the computed hash with the user's stored hash to verify the password.
 *
 * @param {Array} user - An array containing user objects, where the first object includes saltPassword and hashPassword fields.
 * @param {string} password - The password to validate.
 * @returns {Promise<boolean>} A promise that resolves to true if the password is valid, false otherwise.
 * @throws Will throw an error if the user object or required fields are missing.
 */
export const validatePassword = async (user, password) => {
    if (!user || !user[0] || !user[0].saltPassword || !user[0].hashPassword) {
        throw new Error('User or required fields are missing.');
    }
    let salt = user[0].saltPassword;
    for (let i = 0; i < 3; i++) {
        salt = hashPasswordWithSalt(salt, salt);
    }
    const hashedPassword = hashPasswordWithSalt(password, salt);
    return hashedPassword === user[0].hashPassword;
};
