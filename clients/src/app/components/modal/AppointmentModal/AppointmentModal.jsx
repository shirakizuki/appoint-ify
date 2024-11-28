import React from 'react'
import axios from 'axios'

import { ServerContext } from '../../../../context/ServerContext'
import { useState, useEffect, useContext } from 'react'

import './AppointmentModal.css'

const AppointmentModal = ({ closeModal, appointment, onClose }) => {
    const [message, setMessage] = useState('');
    const [cancelReasoned, setCancelReason] = useState('');
    const [loading, setLoading] = useState(false);
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
        cancelReason,
        studentID,
        studentFirstName,
        studentLastName,
        course,
        currentYear,
        email,
        phoneNumber
    } = appointment;

    const approveAppointment = async () => {
        const token = sessionStorage.getItem('token');
        const newUrl = `${url}/approveappointment`;
        setLoading(true);
        try {
            const response = await axios.patch(newUrl, { appointmentID }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200 && response.data.affectedRows === 1) {
                const emailResponse = await axios.post(`${url}/appointment/approve`, { email });
                if (emailResponse.status === 200) {
                    setMessage('Appointment approved successfully.');
                }
            }
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const cancelAppointment = async () => {
        if (!cancelReasoned) {
            setMessage('Please select a reason for cancellation.');
            return;
        }

        const token = sessionStorage.getItem('token');
        const newUrl = `${url}/declineappointment`;
        setLoading(true);
        try {
            const response = await axios.patch(
                newUrl, { appointmentID, cancelReasoned },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200 && response.data.affectedRows === 1) {
                const emailResponse = await axios.post(`${url}/appointment/decline`, { email, cancelReasoned });
                if (emailResponse.status === 200) {
                    setMessage('Appointment cancelled successfully');
                }
            }
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='appointmentModal show'>
            <div className="modalContainer">
                <div className="header">
                    <h1>Appointment</h1>
                    <button onClick={handleClose}>X</button>
                </div>
                {message && <p className="message">{message}</p>}
                {!loading ? (
                    <>
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
                            <div className="inputContainer">
                                <label>Cancel Reason</label>
                                <select value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} disabled={appointmentStatus === 'Approved' || appointmentStatus === 'Declined'}>
                                    <option value="">Select a reason</option>
                                    <option value="Student No-Show">Student No-Show</option>
                                    <option value="Teacher Unavailable">Teacher Unavailable</option>
                                    <option value="Technical Issues">Technical Issues</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="modalfooter">
                            <button className='btn10' id='Approved' disabled={appointmentStatus === "Approved" || appointmentStatus === "Declined"} onClick={approveAppointment}>APPROVE</button>
                            <button className='btn10' id='Declined' disabled={appointmentStatus === "Approved" || appointmentStatus === "Declined"} onClick={cancelAppointment}>DECLINE</button>
                        </div>
                    </>
                ) : (
                    <div className="loading">Loading...</div>
                )}
            </div>
        </div>
    )
}

export default AppointmentModal