/**
 * Generates a unique identifier by combining a timestamp, a random component, 
 * and a random string of characters, and sends it as a JSON response.
 * 
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 */
const generatePrimary = async (req, res) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const timestamp = Date.now().toString(36);
    const randomComponent = Math.floor(Math.random() * 1e8).toString(36).slice(0, 4);
    let randomString = '';
    for (let i = 0; i < 8; i++) {
        randomString += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    const uniqueID = `${timestamp}${randomComponent}${randomString}`;
    res.json({ id: uniqueID });
};

export default generatePrimary