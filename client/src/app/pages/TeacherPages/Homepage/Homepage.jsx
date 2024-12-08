import React from 'react'

import { useState } from 'react';
import { useLocation } from 'react-router-dom';

import NavbarTeacher from '../../../components/Navbar/NavbarTeacher'
import SidebarTeacher from '../../../components/Sidebar/SidebarTeacher'
import ProfilePage from '../Profile/ProfilePage'
import AppointmentPage from '../Appointment/AppointmentPage'
import SchedulePage from '../Schedule/SchedulePage'

import './Homepage.css'

const Homepage = () => {
    const [contentIndex, setContentIndex] = useState(0);

    const renderContent = () => {
        switch (contentIndex) {
            case 0:
                return <ProfilePage />;
            case 1:
                return <AppointmentPage />;
            case 2:
                return <SchedulePage />;
            default:
                return <ProfilePage />;
        }
    };
    
    return (
        <div className='teacher-home-container'>
            <NavbarTeacher />
            <div className="home-wrapper">
                <SidebarTeacher setContent={setContentIndex} />
                <div className="wrapper-content-container">
                    {renderContent()}
                </div>
            </div>
        </div>
    )
}

export default Homepage
