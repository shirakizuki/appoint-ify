import { hashPasswordWithSalt } from '../util/passwordHandler.js';

export const validatePassword = async (password, saltPassword, hashdPassword) => {
    if (!password || !saltPassword || !hashdPassword) {
        throw new Error('User or required fields are missing.');
    }

    let salt = saltPassword;
    for (let i = 0; i < 3; i++) {
        salt = hashPasswordWithSalt(salt, salt);
    }

    const hashedPassword = hashPasswordWithSalt(password, salt);
    return hashedPassword === hashdPassword;
};