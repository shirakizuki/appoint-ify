export const validatePassword = (password) => {return /^.{8,}$/.test(password);}
export const valudateEmail = (email) => {return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);}
export const validateContactNumber = (contactNumber) => {return /^\d{11,}$/.test(contactNumber);}