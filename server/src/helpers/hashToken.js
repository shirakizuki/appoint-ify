import crypto from "crypto";

/**
 * Creates a SHA256 hash of the given token.
 * @param {string} token The token to be hashed.
 * @returns {string} The hashed token.
 */
const hashToken = (token) => {
    return crypto.createHash("sha256").update(token.toString()).digest("hex");
};

export default hashToken;