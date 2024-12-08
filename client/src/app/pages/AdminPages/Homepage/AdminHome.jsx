import React from 'react'

import { useState } from 'react'
import { useLocation } from 'react-router-dom';

import NavbarAdmin from '../../../components/Navbar/NavbarAdmin'
import SidebarAdmin from '../../../components/Sidebar/SidebarAdmin'
import AppointmentList from './ComponentElements/AppointmentList/AppointmentList';
import TeacherList from './ComponentElements/TeacherList/TeacherList';
import TeamManagement from './ComponentElements/TeamManagement/TeamManagement';

import './Homepage.css'

const AdminHome = () => {
    const departmentID = useLocation().state?.departmentID;
    const accountID = useLocation().state?.accountID;
    
    const [contentIndex, setContentIndex] = useState(0);

    const renderContent = () => {
        switch (contentIndex) {
            case 0:
                return <AppointmentList />;
            case 1:
                return <TeacherList />;
            case 2:
                return <TeamManagement />;
            default:
                return <AppointmentList />;
        }
    };

    return (
        <div className='admin-home-container'>
            <NavbarAdmin />
            <div className='home-wrapper'>
                <SidebarAdmin setContent={setContentIndex} />
                <div className="wrapper-content-container">
                    {renderContent()}
                </div>
            </div>
        </div>
    )
}

export default AdminHome
