import React from 'react'
import axios from 'axios'

import { useLocation } from 'react-router-dom';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from "react-big-calendar";
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Badge } from 'primereact/badge';
import moment from "moment";

import ViewAppointmentModal from '../../../components/Modals/AppointmentModals/ViewAppointment/ViewAppointmentModal';

import './AppointmentPage.css'
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const Appointment = () => {

    const url = import.meta.env.VITE_SERVER_API;
    const [loading, setLoading] = useState(true);
    const teacherID = useLocation().state?.teacherID;
    const [appointments, setAppointments] = useState([]);
    const [sortedAppointment, setSortedAppointment] = useState([]);
    const [showViewAppointmentModal, setShowViewAppointmentModal] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    const [upcomingAppointment, setUpcomingAppointment] = useState([]);
    const [pastAppointment, setPastAppointment] = useState([]);
    const [todayAppointment, setTodayAppointment] = useState([]);
    const [actionAppointment, setActionAppointment] = useState([]);

    const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const readTeacherAppointments = async (teacherID) => {
        const token = sessionStorage.getItem('token');
        const newUrl = `${url}/read/current/teacher/appointment?teacherID=${encodeURIComponent(teacherID)}`;
        setLoading(true)
        try {
            const response = await axios.get(newUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.status === 200) {
                setAppointments(response.data.result);
                sortAppointments(response.data.result);
            }
        } catch (error) {
            throw error;
        } finally {
            setLoading(false)
        }
    }

    const sortAppointments = (appointments) => {
        const today = new Date();
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // Start of today
        const todayEnd = new Date(todayStart);
        todayEnd.setDate(todayStart.getDate() + 1);

        const todayAppointments = [];
        const upcomingAppointments = [];
        const pastAppointments = [];
        const actionAppointments = [];

        const app = appointments.map((appointment) => {
            const startDateTime = moment(`${appointment.appointmentDate} ${appointment.startTime}`, "YYYY-MM-DD HH:mm:ss a").toDate();
            const endDateTime = moment(`${appointment.appointmentDate} ${appointment.endTime}`, "YYYY-MM-DD HH:mm:ss").toDate();

            if (startDateTime >= todayStart && startDateTime < todayEnd) {
                todayAppointments.push({ ...appointment });
            }
            else if (startDateTime > todayEnd) {
                upcomingAppointments.push({ ...appointment });
            }
            else {
                pastAppointments.push({ ...appointment });
                if (appointment.appointmentStatus === 'Active') {
                    actionAppointments.push({ ...appointment });
                }
            }

            return {
                title: `${appointment.studentFirstName} ${appointment.studentLastName}`,
                start: startDateTime,
                end: endDateTime,
                data: {
                    id: appointment.appointmentID,
                },
                status: appointment.appointmentStatus,
                isPast: startDateTime < today,
            };
        });
        setTodayAppointment(todayAppointments);
        setUpcomingAppointment(upcomingAppointments);
        setPastAppointment(pastAppointments);
        setSortedAppointment(app);
    };

    const eventPropGetter = (event) => {
        const isPast = event.isPast;
        return {
            style: {
                backgroundColor: isPast ? "gray" : "blue",
                color: "white",
                borderRadius: "5px",
                padding: "5px",
            },
        };
    };

    const selectEvent = (event) => {
        const select = appointments.find(
            (appointment) => appointment.appointmentID === event.data.id
        );

        if (select) {
            setSelectedAppointment(select);
            setShowViewAppointmentModal(true);
        }
    }

    useEffect(() => {
        readTeacherAppointments(teacherID);
    }, [teacherID])

    return (
        <div className="appo-container">
            {showViewAppointmentModal && (
                <ViewAppointmentModal closeModal={() => setShowViewAppointmentModal(false)} appointment={selectedAppointment} onClose={() => readTeacherAppointments(teacherID)} />
            )}
            {loading === true ? (
                <ProgressSpinner />
            ) : (
                <>
                    <div className="middle-wrapper">
                        <div className="schedules-list">
                            <Calendar
                                localizer={localizer}
                                events={sortedAppointment}
                                startAccessor="start"
                                endAccessor="end"
                                defaultView='month'
                                views={["month", "week","day"]}
                                step={30}
                                onSelectEvent={event => selectEvent(event)}
                                eventPropGetter={eventPropGetter}
                            />
                        </div>
                    </div>
                    <div className="right-wrapper">
                        <div className="wrapper-title">
                            <h1>Quick Action</h1>
                        </div>
                        <div className="wrapper-content">
                            <div className="content-list">
                                <Accordion activeIndex={0} className='custom-accordion'>
                                    <AccordionTab 
                                        header={
                                            <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem"}}>
                                                <h3>Today Appointment</h3>
                                                <Badge value={todayAppointment.length} />
                                            </span>} className='custom-accordiontab'>
                                        <div className="list">
                                            {todayAppointment.length === 0 ? (
                                                <div className="list-item">No today's appointment</div>
                                            ) : (
                                                todayAppointment.map((appointment, index) => (
                                                    <div className="list-item" key={index}> {appointment.studentFirstName} {appointment.studentLastName} ({appointment.appointmentDate.slice(0, 10)})</div>
                                                ))
                                            )}
                                        </div>
                                    </AccordionTab>
                                    <AccordionTab
                                        header={
                                            <span style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.5rem"}}>
                                                <h3>Upcoming Appointment</h3>
                                                <Badge value={upcomingAppointment.length} />
                                            </span>} className='custom-accordiontab'>
                                        <div className="list">
                                            {upcomingAppointment.length === 0 ? (
                                                <div className="list-item">No upcoming appointment</div>
                                            ) : (
                                                upcomingAppointment.map((appointment, index) => (
                                                    <div className="list-item" key={index}> {appointment.studentFirstName} {appointment.studentLastName} ({appointment.appointmentDate.slice(0, 10)})</div>
                                                ))
                                            )}
                                        </div>
                                    </AccordionTab>
                                </Accordion>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default Appointment
