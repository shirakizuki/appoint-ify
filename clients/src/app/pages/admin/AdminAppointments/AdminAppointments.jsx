import React from 'react'
import axios from 'axios'

import { useLocation } from 'react-router-dom';
import { ServerContext } from '../../../../context/ServerContext';
import { useState, useContext, useEffect } from 'react';

import AdminNavbar from '../../../components/Navbar/AdminNavbar'
import AppointmentCard from '../../../components/AppointmentCard/AppointmentCard'

import './AdminAppointments.css'

const AdminAppointments = () => {
    const departmentID = useLocation().state?.departmentID;
    const [sortMode, setSortMode] = useState('today')
    const [appointmentList, setAppointmentList] = useState([]);
    const [showModal, setShow] = useState(false);
    const { url } = useContext(ServerContext);

    const handleSortMode = (mode) => {
        setSortMode(mode);
    };

    const loadAppointments = async (departmentID) => {
        const token = sessionStorage.getItem('token');
        const newUrl = `${url}/loadappointmentlist?departmentID=${encodeURIComponent(departmentID)}`;
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

    const sortAppointments = (appointments, mode) => {
        switch (mode) {
            case 'all':
                return appointments;
            case 'upcoming':
                return appointments.filter((appointment) =>
                    new Date(appointment.appointmentDate) > new Date() &&
                    appointment.appointmentStatus === 'Completed'
                );
            case 'pending':
                return appointments.filter((appointment) => appointment.appointmentStatus === 'Pending');
            case 'past':
                return appointments.filter((appointment) => new Date(appointment.appointmentDate) < new Date());
            case 'today':
                return appointments.filter(
                    (appointment) =>
                        new Date(appointment.appointmentDate).toDateString() === new Date().toDateString()
                );
            default:
                return appointments;
        }
    };

    useEffect(() => {
        loadAppointments(departmentID);
    }, [departmentID])

    const sortedAppointments = sortAppointments(appointmentList, sortMode);

    return (
        <>
            <AdminNavbar departmentID={departmentID}/>
            <section className='adminAppointments'>
                <div className="header">
                    <h1>Appointments</h1>
                    <div className="navigators">
                        <button className={`btn07 ${sortMode === 'today' ? 'active' : ''}`} id='all' onClick={() => handleSortMode('today')}>Today</button>
                        <button className={`btn07 ${sortMode === 'upcoming' ? 'active' : ''}`} id='upcoming' onClick={() => handleSortMode('upcoming')}>Upcomming</button>
                        <button className={`btn07 ${sortMode === 'all' ? 'active' : ''}`} id='all' onClick={() => handleSortMode('all')}>All</button>
                        <button className={`btn07 ${sortMode === 'pending' ? 'active' : ''}`} id='pending' onClick={() => handleSortMode('pending')}>Pending</button>
                        <button className={`btn07 ${sortMode === 'past' ? 'active' : ''}`} id='past' onClick={() => handleSortMode('past')}>Past</button>
                    </div>
                </div>
                <div className="appointmentContainer">
                    <div className="appointmentFlow">
                        {sortedAppointments.length > 0 ? (
                            sortedAppointments.map((appointment, index) => (
                                <AppointmentCard key={appointment.appointmentID} appointment={appointment} />
                            ))
                        ) : (
                            <p>No appointments found.</p>
                        )}
                    </div>
                </div>
            </section>
        </>
    )
}

export default AdminAppointments
