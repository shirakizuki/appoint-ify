// IMPORT LIBRARY
import React from 'react'
import axios from 'axios'
// IMPORT HOOKS
import { ServerContext } from '../../../../../context/ServerContext'
import { useContext, useEffect, useState } from 'react';
// IMPOR CSS STYLINGS
import './Profile.css'

/**
 * The TeacherSettings component allows teachers to view and edit their profile information
 * and update their password. It manages the state for editing profile and password information,
 * handles form inputs, and communicates with the server to load and update data.
 * It also displays success and error messages based on the operations performed.
 * 
 * @returns {React.ReactElement} The rendered TeacherSettings component.
 */
const TeacherSettings = ({teacherID}) => {
    // STATES
    const [editInfo, setEditInfo] = useState(false); // State to track if the profile info is being edited
    const [profileMessage, setProfileMessage] = useState(''); // State to store profile-related messages
    const [profileError, setProfileError] = useState([]); // State to store profile-related errors
    const { url } = useContext(ServerContext); // Retrieve the base URL from UserContext
    const [teacher, setTeacher] = useState({ // State to store the teacher's information
        teacherID: teacherID,
        firstName: '',
        lastName: '',
        teacherEmail: '',
        contactNumber: '',
    });

    /**
     * Loads the teacher's information from the server using the provided teacher ID.
     * Retrieves the authentication token from session storage and sends a GET request.
     * If successful, updates the teacher state with the retrieved information.
     * Logs any errors encountered during the request.
     * @param {string} teacherID - The ID of the teacher whose information is to be loaded.
     */
    const loadTeacher = async (teacherID) => {
        const token = sessionStorage.getItem('token');
        const newUrl = `${url}/loadteacher?teacherID=${encodeURIComponent(teacherID)}`;
        try {
            const response = await axios.get(newUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.data.status) {
                const queryTeacher = response.data.teacher?.[0];
                if (queryTeacher) {
                    setTeacher({
                        ...teacher,
                        firstName: queryTeacher.firstName,
                        lastName: queryTeacher.lastName,
                        teacherEmail: queryTeacher.teacherEmail,
                        contactNumber: queryTeacher.contactNumber
                    });
                }
            }
        } catch (err) {
            console.log(err);
            console.error(err.response.data.message);
        }
    };

    /**
     * Updates the teacher's information in the database.
     * If the validation fails, does nothing.
     * If the request fails, sets the error message.
     * If the request is successful, sets the success message and resets the edit mode to false.
     */
    const updateTeacherInfo = async () => {
        const isValid = validateTeacherProfile(teacher);
        if (!isValid) {
            setProfileMessage('');
            return;
        }
        const token = sessionStorage.getItem('token')
        try {
            const { data: { status, message } } = await axios.put(`${url}/updateteacherinformation`, teacher, {
                headers: {
                    'Authorization':`Bearer ${token}`
                }
            });
            if(status) {
                setProfileMessage('Profile updated successfully!');
                loadTeacher(teacherID);
                setEditInfo(false);
                setProfileError([]);
            } else {
                setProfileError(['Failed to update profile. Please try again.']);
            }
        } catch (error) {
            console.error(error);
            setProfileError(['Error updating profile. Please try again later.']);
        }
    };

    /**
     * Checks if an email address is valid. A valid email address must contain a @ symbol and a period, and must not contain any spaces.
     * It must also contain at least one character before the @ symbol and at least two characters after the period.
     * @param {string} email - The email address to check.
     * @returns {boolean} true if the email address is valid, false otherwise.
     */
    const checkValidEmail = (email) => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    };
    
    /**
     * Checks if a contact number is valid. A valid contact number must contain at least 11 digits.
     * @param {string} number - The contact number to check.
     * @returns {boolean} true if the contact number is valid, false otherwise.
     */
    const checkValidNumber = (number) => {
        const numberRegex = /^\d{11,11}$/;
        return numberRegex.test(number);
    };

    /**
     * Validates the teacher profile data by checking if the contact number and email address are valid.
     * If the validation fails, it sets the profile error state with the corresponding error messages.
     * If the validation is successful, it returns true, else it returns false.
     * @param {Object} data - The teacher profile data.
     * @returns {Boolean} True if the validation is successful, false otherwise.
     */
    const validateTeacherProfile = (data) => {
        const errors = [];
        if (!checkValidNumber(data.contactNumber)) {
            errors.push('Please provide a valid contact number.');
        }
        if (!checkValidEmail(data.teacherEmail)) {
            errors.push('Please provide a valid email.');
        }
        setProfileError(errors);
        return errors.length === 0;
    };

    /**
     * Handles the save button click event. When the user clicks the save button, this function will attempt to update the teacher's profile information in the database.
     * If the update is successful, the component will display a success message and set the edit mode to false.
     * If the update fails, the component will display an error message.
     */
    const handleSaveInfoButton = () => {
        updateTeacherInfo();
    }

    /**
     * Handles the cancel button click event. When the user clicks the cancel button, this function resets the teacher profile state with the latest data from the database and sets the edit mode to false.
     * The function also resets the profile error state.
     */
    const handleCancelInfoButton = () => {
        loadTeacher(teacherID);
        setEditInfo(false);
        setProfileError('')
    } 

    /**
     * Handles the input change event. When the user types in one of the input fields, this function updates the teacher profile state with the new value.
     * The function also resets the profile error and message states.
     * @param {InputEvent} e - The input change event
     */
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTeacher((prev) => ({ ...prev, [name]: value }));
        setProfileError([]);
        setProfileMessage('');
    };

    /**
     * Loads the teacher's information from the server when the component mounts.
     * The useEffect hook is used to fetch the data when the component is mounted.
     * The dependency array is set to [teacherID] so that the effect runs only when the
     * teacherID prop changes.
     */
    useEffect(() => {
        loadTeacher(teacherID);
    }, [teacherID]);
    
    return (
        <main className="container">
            <div className="profile-cont">
                <div className="info-cont">
                    <h2>Profile</h2>
                    {profileMessage && (
                        <p style={{ color: 'green' }}>{profileMessage}</p>
                    )}
                    {(profileError && profileError.length > 0) && (
                        <ul>
                            {profileError.map((profileError, index) => {
                                return (
                                    <li key={index}>
                                        <p style={{ color: 'red', background: '#0000' }}>{profileError}</p>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                    <div className="wrap-1">
                        <div className="detail-cont">
                            <h3>Name:</h3>
                            {editInfo ? (
                                <div className='input-cont'>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={teacher.firstName || ''}
                                        onChange={handleInputChange}
                                        placeholder="First Name"
                                    />
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={teacher.lastName || ''}
                                        onChange={handleInputChange}
                                        placeholder="Last Name"
                                    />
                                </div>
                            ) : (
                                <p>{teacher.firstName} {teacher.lastName}</p>
                            )}
                        </div>
                        <div className="detail-cont">
                            <h3>Email:</h3>
                            {editInfo ? (
                                <div className='input-cont'>
                                    <input
                                        type="email"
                                        name="teacherEmail"
                                        value={teacher.teacherEmail || ''}
                                        onChange={handleInputChange}
                                        placeholder="Email"
                                    />
                                </div>
                            ) : (
                                <p>{teacher.teacherEmail}</p>
                            )}
                        </div>
                        <div className="detail-cont">
                            <h3>Contact Number:</h3>
                            {editInfo ? (
                                <div className='input-cont'>
                                    <input
                                        type="tel"
                                        name="contactNumber"
                                        value={teacher.contactNumber || ''}
                                        onChange={handleInputChange}
                                        placeholder="Contact Number"
                                    />
                                </div>
                            ) : (
                                <p>{teacher.contactNumber}</p>
                            )}
                        </div>
                    </div>
                    {/* Render Save and Cancel buttons when in edit mode */}
                    <div className="footer">
                        {editInfo ? (
                            <div className='btn-cont'>
                                <button onClick={() => handleSaveInfoButton()}>Save</button>
                                <button onClick={() => handleCancelInfoButton()}>Cancel</button>
                            </div>
                        ) : (
                            <button onClick={() => setEditInfo(true)}>Edit Profile</button>
                        )}
                    </div>
                </div>
            </div>
        </main>
    )
}

export default TeacherSettings