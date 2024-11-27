import React from 'react'
import axios from 'axios'

import { ServerContext } from '../../../../context/ServerContext'
import { useState, useEffect, useContext } from 'react'

import './AppointmentModal.css'

//loadstudentappointment

const AppointmentModal = ({ closeModal, appointment, onClose }) => {

    /**
     * TO DO:
     * --- Add cancel input functionality.
     * --- Enhance UI.
     */

    const [message, setMessage] = useState('');
    const { url } = useContext(ServerContext);

    const handleClose = () => {
        closeModal();
        onClose();
    }

    const {
        appointmentID,
        startTime,
        endTime,
        appointmentStatus,
        teacherFirstName,
        teacherLastName,
        referenceCode,
        appointmentPurpose,
        appointmentDuration,
        appointmentDate,
        studentID,
        studentFirstName,
        studentLastName,
        course,
        currentYear,
        email,
        phoneNumber
    } = appointment;

    const approveAppointment = async (appointmentStatus) => {
        const token = sessionStorage.getItem('token');
        const newUrl = `${url}/approveappointment`;
        try {
            const response = await axios.patch(newUrl, { appointmentID, appointmentStatus }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200 && response.data.affectedRows === 1) {
                setMessage('Appointment approved successfully');
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        console.log(appointmentStatus)
    })

    return (
        <div className='appointmentModal show'>
            <div className="modalContainer">
                <div className="header">
                    <h1>Appointment</h1>
                    <button onClick={handleClose}>X</button>
                </div>
                {message && <p className="message">{message}</p>}
                <div className="body">
                    <div className="inputContainer">
                        <label>Reference Code</label>
                        <input type='text' id='refCode' value={referenceCode} readOnly disabled />
                    </div>
                    <div className="inputContainer">
                        <label>Schedule Date</label>
                        <input type='text' id='appointmentDate' value={appointmentDate.slice(0, 10)} readOnly disabled />
                    </div>
                    <div className="inputContainer">
                        <label>Time Slot</label>
                        <input type='text' id='slotTime' value={`${startTime.slice(0, 5)} - ${endTime.slice(0, 5)}`} readOnly disabled />
                    </div>
                    <div className="inputContainer">
                        <label>Teacher Name</label>
                        <input type='text' id='teacherName' value={teacherFirstName + ' ' + teacherLastName} readOnly disabled />
                    </div>
                    <div className="inputContainer">
                        <label>Duration</label>
                        <input type='text' id='appointmentDurations' value={appointmentDuration} readOnly disabled />
                    </div>
                    <div className="inputContainer">
                        <label>Purpose</label>
                        <input type='text' id='appointmentPurpose' value={appointmentPurpose} readOnly disabled />
                    </div>
                    <div className="inputContainer">
                        <label>Student ID</label>
                        <input type='text' id='studentID' value={studentID} readOnly disabled />
                    </div>
                    <div className="inputContainer">
                        <label>Student Name</label>
                        <input type='text' id='studentName' value={studentFirstName + ' ' + studentLastName} readOnly disabled />
                    </div>
                    <div className="inputContainer">
                        <label>Course & Year</label>
                        <input type='text' id='courseYear' value={course + ' ' + currentYear} readOnly disabled />
                    </div>
                    <div className="inputContainer">
                        <label>Email</label>
                        <input type='text' id='email' value={email} readOnly disabled />
                    </div>
                    <div className="inputContainer">
                        <label>Phone Number</label>
                        <input type='text' id='phoneNumber' value={phoneNumber} readOnly disabled />
                    </div>
                </div>
                <div className="footer">
                    <button className='btn10' id='Approved' disabled={appointmentStatus === "Approved" || appointmentStatus === "Declined"} onClick={(event) => approveAppointment(event.target.id)}>APPROVE</button>
                    <button className='btn10' id='Declined' disabled={appointmentStatus === "Approved" || appointmentStatus === "Declined"}>DECLINE</button>
                </div>
            </div>
        </div>
    )
}

export default AppointmentModal
