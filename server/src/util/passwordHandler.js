import crypto from 'crypto'
import { generateSalt } from './generatorHandler.js';

export const hashPasswordWithSalt = (password, salt) => {
    const combined = password + salt;
    return crypto.createHash('sha256').update(combined).digest('hex');
}

export const createSaltedHash = (password, salt) => {
    for(let i=0; i<3; i++) {
        salt = hashPasswordWithSalt(salt, salt);
    }
    return hashPasswordWithSalt(password, salt);
}