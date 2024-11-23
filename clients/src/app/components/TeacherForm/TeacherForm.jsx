// IMPORT LIBRARY
import React from 'react'
import axios from 'axios'
// IMPORT HOOKS
import { ServerContext } from '../../../context/ServerContext'
import { useState, useEffect, useContext } from 'react'
// IMPORT CSS STYLINGS
import './TeacherForm.css'

const TeacherForm = ({closeModal, departmentID, onClose}) => {
    // STATES
    const [data, setData] = useState({
        departmentID: departmentID,
        firstName:'',
        lastName:'',
        teacherEmail:'',
        contactNumber:'',
        teacherPassword:'',
        teacherConfirmPassword:''
    })
    const [error, setErrors] = useState([])
    const [success, setMessage] = useState('')
    const { url } = useContext(ServerContext)

    /**
     * Handles the input change event. When the user types in one of the input fields, this function updates the form data state with the new value.
     * The function also resets the success message state.
     * @param {InputEvent} event - The input change event
     */
    const onInputChange = (event) => {
        setData(prevData => ({...prevData, [event.target.id]: event.target.value}));
        setMessage('');
        setErrors([]);
    }

    /**
     * Handles the keydown event. If the user presses F5 or Ctrl+R, and they have not confirmed that they want to refresh the page, this function will prevent the page from reloading.
     * @param {KeyboardEvent} e - The keydown event
     */
    const handleKeyDown = (e) => {
        if ((e.key === 'F5' || e.keyCode === 116) && !window.confirm('Are you sure you want to refresh the page? This will reset your changes.')) {
            e.preventDefault()
        }
    }
    
    /**
     * Resets the form data state with initial values and resets the form with the most efficient method.
     * This function is used to reset the form data when the user closes the form modal or submits the form.
     */
    const resetForm = () => {
        setData(prevData => ({
            ...prevData,
            firstName: '',
            lastName: '',
            teacherEmail: '',
            contactNumber: ''
        }));
        setErrors([]);
        document.forms['teacher-form'].reset();
    }

    /**
     * Resets the form data state with initial values and resets the form with the most efficient method.
     * Also closes the form modal and calls the onClose function passed as a prop.
     * This function is used to reset the form data when the user closes the form modal or submits the form.
     */
    const clearFormOnClose = () => {
        resetForm()
        closeModal()
        onClose()
    }

    /**
     * Checks if a password is valid. A valid password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character from the set "@_.!$%&*".
     * @param {string} password - The password to check.
     * @returns {boolean} true if the password is valid, false otherwise.
     */
    const checkValidPassword = (password) => {
        const passwordRegex = /^.{8,}$/;
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

    /**
     * Checks if a password and a confirmation password match.
     * @param {string} password - The password to check.
     * @param {string} confirmPassword - The confirmation password to check.
     * @returns {boolean} true if the passwords match, false otherwise.
     */
    const passwordMatch = (password, confirmPassword) => {
        return password === confirmPassword;
    }

    /**
     * Validates the form data provided by the user. 
     * Checks if the passwords match, if the password meets the required criteria,
     * and if the contact number and email are valid.
     * If any validation fails, appropriate error messages are collected.
     * @param {Object} data - The form data containing password, confirmPassword, contactNumber, and teacherEmail.
     */
    const validateForm = (data) => {
        if (!passwordMatch(data.password, data.confirmPassword)) {
            setErrors(prevErrors => [...prevErrors, 'Password did not match. Please verify password.']);
        }
    
        if (!checkValidPassword(data.password)) {
            setErrors(prevErrors => [...prevErrors, 'Password must at least be 8 characters.']);
        }
    
        if (!checkValidNumber(data.contactNumber)) {
            setErrors(prevErrors => [...prevErrors, 'Please provide valid contact number.']);
        }
    
        if (!checkValidEmail(data.teacherEmail)) {
            setErrors(prevErrors => [...prevErrors, 'Please provide valid email.']);
        }
    }

    /**
     * Handles the form submission event to create a new teacher.
     * Validates the form data first, and if there are any errors, it will display them.
     * If the form data is valid, it will send a POST request to the server to create the teacher.
     * If the request is successful, it will reset the form data and display a success message.
     * If the request is not successful, it will display an error message.
     * @param {Event} event - The form submission event.
     */
    const createTeacherInfo = async (event) => {
        event.preventDefault(); // Prevent default form submission behavior
        validateForm(data) 
        if(error.length > 0) {
            return;
        }
        const token = sessionStorage.getItem('token');
        try {
            const { data: { status, message } } = await axios.post(`${url}/createteacher`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            }); 

            if (status) {
                resetForm();
                setMessage(message);
            } else {
                setErrors(prevErrors => [...prevErrors, message])
            };
        } catch (err) {
            if (err.response) {
                const errorMessage = err.response.data.message || "An unexpected error occurred. Please try again.";
                setErrors(prevErrors => [...prevErrors, errorMessage]);
            } else {
                setErrors(prevErrors => [...prevErrors, "An error occurred. Please try again later."]);
            }
        }
    }

    /**
     * Handles the useEffect hook. Uses the spread operator to clone the data object and set the initial state of the form data.
     * Adds an event listener to the window to prevent the page from reloading when the user presses F5 or Ctrl+R and they have not confirmed that they want to refresh the page.
     * Removes the event listener when the component unmounts.
     */
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown); // Add event listener for keydown event to prevent page reload
        return () => window.removeEventListener('keydown', handleKeyDown); // Remove event listener when component unmounts
    }, [departmentID]);

    return (
        <div className="popup show">
            <div className="form-body content">
                <div className="first-form-header">
                    <h2>Teacher Form</h2>
                    {/* Button to close the form modal */}
                    <button onClick={clearFormOnClose}>Close</button>
                </div>
                {/* Display success message if the form is submitted successfully */}
                {success && <p style={{ color: 'green', background: '#0000' }}>{success}</p>}
                {(error && error.length > 0) && (
                    <ul>
                        {error.map((error, index) => {
                            return (
                                <li key={index}>
                                    <p style={{ color: 'red', background: '#0000' }}>{error}</p>
                                </li>
                            );
                        })}
                    </ul>
                )}
                <div className="form-body">
                    {/* Form for teacher details */}
                    <form name='teacher-form' onSubmit={createTeacherInfo} >
                        <div className="text-fields">
                            {/* Left side of the form for first name and email */}
                            <div className="left">
                                {/* Input for first name */}
                                <div className="form-input-container">
                                    <label htmlFor="firstName">First Name</label>
                                    <input type="text" name='firstName' id='firstName' onChange={onInputChange} tabIndex={'1'} required />
                                </div>
                                {/* Input for email */}
                                <div className="form-input-container">
                                    <label htmlFor="teacherEmail">Email</label>
                                    <input type="email" name='teacherEmail' id='teacherEmail' onChange={onInputChange} tabIndex={'3'} required />
                                </div>
                                {/* Input for username */}
                                <div className="form-input-container">
                                    <label htmlFor="teacherPassword">Password</label>
                                    <input type="password" name='teacherPassword' id='teacherPassword' onChange={onInputChange} tabIndex={'5'} required />
                                </div>
                            </div>
                            {/* Right side of the form for last name and contact number */}
                            <div className="right">
                                {/* Input for last name */}
                                <div className="form-input-container">
                                    <label htmlFor="lastName">Last Name</label>
                                    <input type="text" name='lastName' id='lastName' onChange={onInputChange} tabIndex={'2'} required />
                                </div>
                                {/* Input for contact number */}
                                <div className="form-input-container">
                                    <label htmlFor="contactNumber">Contact Number</label>
                                    <input type="text" name='contactNumber' id='contactNumber' onChange={onInputChange} tabIndex={'4'} required />
                                </div>
                                {/* Input for username */}
                                <div className="form-input-container">
                                    <label htmlFor="teacherConfirmPassword">Confirm Password</label>
                                    <input type="password" name='teacherConfirmPassword' id='teacherConfirmPassword' onChange={onInputChange} tabIndex={'6'} required />
                                </div>
                            </div>
                        </div>
                        {/* Footer for the form containing the submit button */}
                        <div className="form-footer">
                            <button className='at-button' type='submit'>SUBMIT</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default TeacherForm