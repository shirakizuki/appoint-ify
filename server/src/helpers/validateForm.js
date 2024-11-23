/**
 * Checks if a password is valid. A valid password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character from the set "@_.!$%&*".
 * @param {string} password - The password to check.
 * @returns {boolean} true if the password is valid, false otherwise.
 */
const checkValidPassword = (password) => {
    const passwordRegex = /^\d{11,}$/;
    return passwordRegex.test(password);
}

/**
 * Checks if an email address is valid. A valid email address must contain a @ symbol and a period, and must not contain any spaces.
 * It must also contain at least one character before the @ symbol and at least two characters after the period.
 * @param {string} email - The email address to check.
 * @returns {boolean} true if the email address is valid, false otherwise.
 */
const checkValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

/**
 * Checks if a contact number is valid. A valid contact number must contain at least 11 digits.
 * @param {string} number - The contact number to check.
 * @returns {boolean} true if the contact number is valid, false otherwise.
 */
const checkValidNumber = (number) => {
    const numberRegex = /^\d{11,}$/;
    return numberRegex.test(number);
}

const passwordMatch = (password, confirmPassword) => {
    return password === confirmPassword;
}

/**
 * Validates the teacher form data by checking if the passwords match, if the password meets the set criteria,
 * and if the contact number and email are valid. If any validation fails, it collects the corresponding error
 * messages in an array and returns it.
 * @param {Object} data - The form data containing teacherPassword, teacherConfirmPassword, contactNumber, and teacherEmail.
 * @returns {Array} An array of error messages if validation fails, or an empty array if validation is successful.
 */
export const validateForm = (data) => {
    const errors = [];

    if (!passwordMatch(data.teacherPassword, data.teacherConfirmPassword)) {
        errors.push('Password did not match. Please verify password.');
    }

    if (checkValidPassword(data.teacherPassword)) {
        errors.push('Password does not meet the set criteria.');
    }

    if (!checkValidNumber(data.contactNumber)) {
        errors.push('Please provide valid contact number.');
    }

    if (!checkValidEmail(data.teacherEmail)) {
        errors.push('Please provide valid email.');
    }

    // Set all errors at once
    if (errors.length > 0) {
        return errors;
    }
}