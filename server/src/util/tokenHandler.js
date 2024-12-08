import crypto from 'crypto';

export const hashToken = (token) => {
    return crypto.createHash("sha256").update(token.toString()).digest("hex");
};