import React from 'react'

import { useState, useEffect } from 'react';
import { images } from '../../../../assets/assets';
import { useLocation } from 'react-router-dom';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';

import './ProfilePage.css'

import EditTeacher from '../../../components/Modals/TeacherModals/EditTeacher/EditTeacher';

const ProfilePage = () => {

    const teacherID = useLocation().state?.teacherID;
    const [totalStudents, setTotalStudents] = useState(0);
    const [totalAppointments, setTotalAppointments] = useState(0);
    const [activeAppointments, setActiveAppointments] = useState(0);
    const [cancelledAppointments, setCancelledAppointments] = useState(0);
    const [completedAppointments, setCompletedAppointments] = useState(0);
    const [declinedAppointments, setDeclinedAppointments] = useState(0);
    const [viewTeacherProfile, setViewTeacherProfile] = useState(false);

    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const readDashboardData = async (teacherID) => {
        const token = sessionStorage.getItem('token');
        const url = import.meta.env.VITE_SERVER_API;
        const newUrl = `${url}/read/current/teacher/dashboard?teacherID=${encodeURIComponent(teacherID)}`;

        try {
            const response = await fetch(newUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                const result = data.dashboardData[0];

                setTotalStudents(result.completedAppointments);
                setTotalAppointments(result.totalAppointments);
                setActiveAppointments(result.activeAppointments);
                setCancelledAppointments(result.cancelledAppointments);
                setCompletedAppointments(result.completedAppointments);
                setDeclinedAppointments(result.declinedAppointments);
            } else {
                console.error("Failed to fetch dashboard data:", response.statusText);
            }
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    };

    useEffect(() => {
        readDashboardData(teacherID);
    }, [teacherID])

    useEffect(() => {
        const interval = setInterval(() => {
            readDashboardData(teacherID)
        }, 2000);
        return () => clearInterval(interval);
    }, [teacherID])

    return (
        <div className='profile-container'>
            {viewTeacherProfile && <EditTeacher closeModal={() => setViewTeacherProfile(false)}/>}
            <div className="left-wrapper">
                <div className="date-wrapper">
                    <h2 className='date'>{date}</h2>
                </div>
                <Calendar inline className="calendar-wrapper" />
            </div>
            <div className="right-wrapper">
                <div className="wrapper-header">
                    <h1>Profile</h1>
                </div>
                <div className="wrapper-message">
                    <div className="message">
                        <h1>Welcome back, Teacher!</h1>
                        <p>"If you really closely, most overnight successes took a long time. - Steve Jobs"</p>
                    </div>
                    <div className="image-logo">
                        <img src={images.hi_image} alt="" />
                    </div>
                </div>
                <div className="wrapper-analytics">
                    <div className="card">
                        <div className="cheader">
                            <h3>TOTAL SERVED STUDENTS</h3>
                        </div>
                        <div className="cbody">
                            <h2>{totalStudents}</h2>
                        </div>
                    </div>
                    <div className="card">
                        <div className="cheader">
                            <h3>TOTAL APPOINTMENTS</h3>
                        </div>
                        <div className="cbody">
                            <h2>{totalAppointments}</h2>
                            <div>
                                <h3>{activeAppointments} - Active</h3>
                                <h3>{cancelledAppointments} - Cancelled</h3>
                                <h3>{declinedAppointments} - Declined</h3>
                            </div>
                        </div>
                    </div>
                    <div className="card">
                        <div className="cheader">
                            <h3>PROFILE</h3>
                        </div>
                        <div className="cbody">
                            <img src={images.teacher_image} alt="teacher_logo" className='teacher-img'/>
                        </div>
                        <div className="cfooter">
                            <Button label="Edit Profile" className='edit-btn' onClick={() => setViewTeacherProfile(true)}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage