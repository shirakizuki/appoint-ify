// IMPORT LIBRARY
import React from 'react';
import axios from 'axios';
// IMPORT HOOKS
import { useLocation } from 'react-router-dom';
import { ServerContext } from '../../../../context/ServerContext';
import { useEffect, useState, useContext } from 'react';
import { Calendar, momentLocalizer } from "react-big-calendar";
// IMPORT COMPONENTS
import moment from "moment";
import TeacherNavbar from '../../../components/Navbar/TeacherNavbar/TeacherNavbar'
// IMPOR CSS STYLINGS
import './TeacherHomepage.css'
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const TeacherHomepage = () => {
    const teacherID = useLocation().state?.teacherID;
    const [rawAppointments, setRawAppointments] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const { url } = useContext(ServerContext);

    const fetchAppointments = async () => {
        const token = sessionStorage.getItem('token');
        const newUrl = `${url}/loadappointmentlist?departmentID=null&teacherID=${encodeURIComponent(teacherID)}`;
        try {
            const response = await axios.get(newUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = response.data.result;
            setRawAppointments(data);
            const formattedAppointments = data.map((appointment) => {
                const startDateTime = moment(`${appointment.appointmentDate} ${appointment.startTime}`, "YYYY-MM-DD HH:mm:ss a").toDate();
                const endDateTime = moment(`${appointment.appointmentDate} ${appointment.endTime}`, "YYYY-MM-DD HH:mm:ss").toDate();
                return {
                    title: '',
                    start: startDateTime,
                    end: endDateTime,
                    studentName: `${appointment.studentFirstName} ${appointment.studentLastName}`,
                    appointmentInfo: appointment
                };
            });

            const mergedAppointments = [];
            formattedAppointments.sort((a, b) => a.start - b.start);
            formattedAppointments.forEach((appointment) => {
                const last = mergedAppointments[mergedAppointments.length - 1];
                if (
                    last &&
                    last.end >= appointment.start
                ) {
                    last.end = new Date(Math.max(last.end.getTime(), appointment.end.getTime()));
                    last.title = "Multiple Appointments";
                    last.studentName = [...(last.studentName || []), appointment.studentName];
                } else {
                    mergedAppointments.push({
                        ...appointment,
                        students: [appointment.studentName],
                    });
                }
            });
            
            setAppointments(mergedAppointments.map((appointment) => ({
                title: `(${appointment.students.join(", ")})`,
                start: appointment.start,
                end: appointment.end,
            })));
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAppointments();
    }, [teacherID])

    const onClasdasdick = () => {
        alert('click')
    }

    return (
        <>
            <TeacherNavbar teacherID={teacherID} />
            <section className='teacherHomepage'>
                {loading ? (
                    <p>Loading appointments...</p>
                ) : (
                    <Calendar
                        localizer={localizer}
                        events={appointments}
                        startAccessor="start"
                        endAccessor="end"
                        defaultView='week'
                        views={["week", "day"]}
                        onSelectEvent={(event) => {
                            alert(`Event Details:
                            Title: ${event.title}
                            Start: ${event.start}
                            End: ${event.end}`);
                        }}
                    />
                )}
            </section>
        </>
    )
}

export default TeacherHomepage
