import React, { useEffect } from 'react'
import axios from 'axios'

import { ToastContainer, toast } from "react-toastify";
import { RiCloseLine } from "react-icons/ri";
import { useState } from 'react';

import Button_1 from '../../../Button/Button_1';
import LoadingAnimation from '../../../../components/Animations/LoadingAnimation/LoadingAnimation'
import TextBox from '../../../InputContainer/TextBox';

import './ViewAppointmentModal.css';
import "react-toastify/dist/ReactToastify.css";

const ViewAppointmentModal = ({ closeModal, appointment, onClose }) => {
    const [loading, setLoading] = useState(false);
    const url = import.meta.env.VITE_SERVER_API;

    const [decline, setDecline] = useState(false);
    const [cancel, setCancel] = useState(false);
    const [disable, setDisable] = useState(false);
    const [cancelReason, setCancelReason] = useState('');

    const showSuccessMessage = (message) => {
        toast.success(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            theme: "light",
        });
    };

    const showErrorMessage = (message) => {
        toast.error(message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: false,
            theme: "light",
        });
    };

    // -- Basic flow
    /**
     * 
     * If the current status of the appointment is pending, then the admin can decline or approve the appointment.
     * If the current status of the appointment is active, then the admin can cancel or complete the appointment.
     * 
     */
    const updateStatus = async (appointmentID, appointmentStatus, cancelReason = null) => {
        const token = sessionStorage.getItem('token');
        const newUrl = `${url}/update/current/appointment/status`;

        if (decline && (!cancelReason || (typeof cancelReason === 'string' && (cancelReason.trim().length === 0 || /^[0-9]+$/.test(cancelReason.trim()) || cancelReason.trim().length === 1)))) {
            showErrorMessage('Please provide a cancel reason.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.patch(newUrl, { appointmentID, appointmentStatus, cancelReason }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                showSuccessMessage('Successfully updated appointment.');
                appointment.appointmentStatus = appointmentStatus;
                appointment.cancelReason = cancelReason;
            }
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
            setDecline(false);
            setCancel(false);
        }
    };

    const handleModalOnClose = () => {
        onClose();
        closeModal();
    }

    useEffect(() => {
        const currentDate = new Date();
        const appointmentDate = new Date(appointment.appointmentDate);
        
        if( currentDate < appointmentDate && appointment.appointmentStatus === 'Active') {
            setDisable(true);
        } else {
            setDisable(false);
        }
        
    }, [appointment.appointmentDate, appointment.appointmentStatus]);

    return (
        <div className='modal show'>
            <ToastContainer />
            <div className="view-appointment-modal">
                {loading === true ? (
                    <LoadingAnimation />
                ) : (
                    <>
                        <div className="appointment-header">
                            <h2>Appointment Details</h2>
                            <RiCloseLine onClick={handleModalOnClose} className='close-button' />
                        </div>
                        <div className="appointment-body">
                            <div className="appointment">
                                <div className="app-header">
                                    <p>Appointment Information</p>
                                </div>
                                <div className="appointment-container">
                                    <div className="label-container">
                                        <label className="label">Reference Code:</label>
                                        <TextBox type='text' disabled={true} value={appointment.referenceCode} />
                                    </div>
                                    <div className="label-container">
                                        <label className="label">Appointment Date:</label>
                                        <TextBox type='text' disabled value={appointment.appointmentDate.slice(0, 10)} />
                                    </div>
                                    <div className="label-container">
                                        <label className="label">Appointment Time:</label>
                                        <TextBox type='text' disabled value={appointment.startTime.slice(0, 5) + ' - ' + appointment.endTime.slice(0, 5)} />
                                    </div>
                                    <div className="label-container">
                                        <label className="label">Appointment Duration:</label>
                                        <TextBox type='text' disabled value={appointment.appointmentDuration + ' minutes'} />
                                    </div>
                                    <div className="label-container">
                                        <label className="label">Appointment Status:</label>
                                        <TextBox type='text' disabled value={appointment.appointmentStatus} />
                                    </div>
                                    <div className="label-container">
                                        <label className="label">Book Teacher:</label>
                                        <TextBox type='text' disabled value={appointment.teacherFirstName + ' ' + appointment.teacherLastName} />
                                    </div>
                                    <div className="label-container">
                                        <label className="label">Purpose:</label>
                                        <TextBox type='text' disabled value={appointment.appointmentPurpose} />
                                    </div>
                                    {(appointment.appointmentStatus === 'Cancelled' || appointment.appointmentStatus === 'Decline') && (
                                        <div className="label-container">
                                            <label className="label">Cancel Reason:</label>
                                            <TextBox type='text' disabled value={appointment.cancelReason} />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="student">
                                <div className="student-header">
                                    <p>Student Information</p>
                                </div>
                                <div className="student-container">
                                    <div className="label-container">
                                        <label className="label">Student ID:</label>
                                        <TextBox type='text' disabled value={appointment.studentID} />
                                    </div>
                                    <div className="label-container">
                                        <label className="label">Student Name:</label>
                                        <TextBox type='text' disabled value={appointment.studentFirstName + ' ' + appointment.studentLastName} placeholder={'Enter Student Name'} />
                                    </div>
                                    <div className="label-container">
                                        <label className="label">Email:</label>
                                        <TextBox type='text' disabled value={appointment.email} />
                                    </div>
                                    <div className="label-container">
                                        <label className="label">Phone Number:</label>
                                        <TextBox type='text' disabled value={appointment.phoneNumber} />
                                    </div>
                                    <div className="label-container">
                                        <label className="label">Course & Year:</label>
                                        <TextBox type='text' disabled value={appointment.course + ' ' + appointment.currentYear} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="appointment-footer">
                            {/* 
                              * If appointment status is pending, show 'Decline' and 'Approve' buttons.
                              * If appointment status was approved, change appointment status to 'Active'. Also show 'Cancel' and 'Complete' buttons.
                              * If appointment status was cancelled, change appointment status to 'Decline'. Also prompt user for cancel reason.
                              */}
                            {appointment.appointmentStatus === 'Pending' && (
                                <>
                                    <Button_1 text="Decline" onClick={() => setDecline(true)} disabled={decline}/>
                                    <Button_1 text="Approve" onClick={() => { updateStatus(appointment.appointmentID, 'Active')}} disabled={decline}/>
                                </>
                            )}
                            {/* 
                              * If appointment status is pending, show 'Cancel' and 'Complete' buttons.
                              * If appointment status was cancelled, change appointment status to 'Completed'.
                              * If appointment status was cancelled, change appointment status to 'Decline'. Also prompt user for cancel reason.
                              */}
                            {appointment.appointmentStatus === 'Active' && (
                                <>
                                    <Button_1 text="Cancel" onClick={() => setCancel(true)} disabled={cancel}/>
                                    <Button_1 text="Complete" onClick={() => { updateStatus(appointment.appointmentID, 'Completed')}} disabled={cancel || disable}/>
                                </>
                            )}
                        </div>
                        {/* 
                          * If appointment status is pending and decline is true, show decline reason input.
                          * If Submit was clicked, change appointment status to 'Decline'.
                          */}
                        {decline === true && (
                            <div className="cancel-body">
                                <RiCloseLine onClick={() => { setDecline(false); setCancelReason(''); }} className='cancel-button' />
                                <TextBox placeholder="Reason for declining this appointment." value={cancelReason} change={(e) => setCancelReason(e.target.value)} />
                                <Button_1 text="Submit" onClick={() => { updateStatus(appointment.appointmentID, 'Decline', cancelReason)}} />
                            </div>
                        )}
                        {/* 
                          * If appointment status is pending and decline is true, show decline reason input.
                          * If Submit was clicked, change appointment status to 'Decline'.
                          */}
                        {cancel === true && (
                            <div className="cancel-body">
                                <RiCloseLine onClick={() => setCancel(false)} className='cancel-button' />
                                <TextBox placeholder="Reason for cancellation" value={cancelReason} change={(e) => setCancelReason(e.target.value)} />
                                <Button_1 text="Submit" onClick={() => { updateStatus(appointment.appointmentID, 'Cancelled', cancelReason)}} />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default ViewAppointmentModal
