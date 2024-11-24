export const generateRefCode = () => {
    return Math.random().toString(36).substring(2, 12).toUpperCase();
}