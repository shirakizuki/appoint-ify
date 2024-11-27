import React from 'react'
import axios from 'axios'

import { useLocation } from 'react-router-dom';
import { ServerContext } from '../../../../context/ServerContext';
import { useState, useContext, useEffect } from 'react';

import AdminNavbar from '../../../components/Navbar/AdminNavbar'

import './AdminAppointments.css'
import AppointmentModal from '../../../components/modal/AppointmentModal/AppointmentModal';

const AdminAppointments = () => {

    /**
     * TO DO:
     * --- Add filter / search functionality.
     * --- Add calendar.
     * --- Enhance UI.
     */

    const departmentID = useLocation().state?.departmentID;
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [appointmentList, setAppointmentList] = useState([]);
    const [showModal, setShow] = useState(false);
    const { url } = useContext(ServerContext);

    const dateFormatter = (date) => {
        const newDate = new Date(date);
        const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
        const formattedDate = newDate.toLocaleDateString('en-PH', options);

        return formattedDate;
    }

    const loadAppointments = async (departmentID) => {
        const token = sessionStorage.getItem('token');
        const newUrl = `${url}/loadappointmentlist?departmentID=${encodeURIComponent(departmentID)}&teacherID=null`;
        try {
            const response = await axios.get(newUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                setAppointmentList(response.data.result);
            }
        } catch (error) {
            throw error
        }
    }

    const openForm = async (appointment) => {
        setSelectedAppointment(appointment);
        setShow(true);
    }

    useEffect(() => {
        loadAppointments(departmentID);
    }, [departmentID])

    return (
        <>
            <AdminNavbar departmentID={departmentID} />
            {showModal && (
                <AppointmentModal closeModal={() => setShow(false)} appointment={selectedAppointment} onClose={() => {setShow(false); loadAppointments(departmentID)}} />
            )}
            <section className='adminAppointments'>
                <div className="header">
                    <h1>Appointments</h1>
                </div>
                <div className="wrapper">
                    <div className="appointmentTable">
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Apointee Name</th>
                                    <th>Student ID</th>
                                    <th>Reference Code</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointmentList.map((appointment) => (
                                    <tr key={appointment.appointmentID}>
                                        <td>{dateFormatter(appointment.appointmentDate)}</td>
                                        <td>{appointment.studentFirstName} {appointment.studentLastName}</td>
                                        <td>{appointment.studentID}</td>
                                        <td>{appointment.referenceCode}</td>
                                        <td>
                                            <span
                                                style={{
                                                    color:
                                                        appointment.appointmentStatus === 'Pending'
                                                            ? 'orange'
                                                            : appointment.appointmentStatus === 'Declined'
                                                                ? 'red'
                                                                : 'green',
                                                }}
                                            >
                                                {appointment.appointmentStatus}
                                            </span>
                                        </td>
                                        <td>
                                            <button className="btn03 view" onClick={() => openForm(appointment)}>View</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="appointmentWrapepr">

                    </div>
                </div>
            </section>
        </>
    )
}

export default AdminAppointments
