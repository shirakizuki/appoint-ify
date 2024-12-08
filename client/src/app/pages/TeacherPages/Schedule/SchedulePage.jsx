import React from 'react'

import { Calendar } from 'primereact/calendar';
import { useLocation } from 'react-router-dom';

import TeacherSchedule from './TeacherSchedule/TeacherSchedule';

import './SchedulePage.css'

const SchedulePage = () => {
    const teacherID = useLocation().state?.teacherID;
    const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className='schedule-container'>
            <div className="left-wrapper">
                <div className="date-wrapper">
                    <h2 className='date'>{currentDate}</h2>
                </div>
                <Calendar inline className="calendar-wrapper" />
            </div>
            <div className="right-wrapper">
                <div className="wrapper-header">
                    <h1>Schedule</h1>
                </div>
                <div className="wrapper-scheduler">
                    <TeacherSchedule teacherID={teacherID}/>
                </div>
            </div>
        </div>
    )
}

export default SchedulePage
