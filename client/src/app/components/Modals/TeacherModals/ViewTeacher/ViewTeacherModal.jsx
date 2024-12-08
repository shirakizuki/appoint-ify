import React from 'react'
import axios from 'axios'

import { ToastContainer, toast } from "react-toastify";
import { RiCloseLine } from "react-icons/ri";
import { useState, useEffect } from 'react'

import Button_1 from '../../../Button/Button_1';
import LoadingAnimation from '../../../../components/Animations/LoadingAnimation/LoadingAnimation'

import './ViewTeacherModal.css'
import "react-toastify/dist/ReactToastify.css";

const ViewTeacherModal = ({ closeModal, teacher, onClose }) => {
    const [scheduleList, setScheduleList] = useState([]);
    const [loading, setLoading] = useState(false);
    const url = import.meta.env.VITE_SERVER_API;

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

    const loadWeeklySchedule = async (teacherID) => {
        const token = sessionStorage.getItem('token');

        if (!teacherID) {
            console.log("No teacher ID provided");
            return;
        }

        const newUrl = `${url}/read/current/teacher/schedule?teacherID=${encodeURIComponent(teacherID)}`;
        setLoading(true);
        try {
            const response = await axios.get(newUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response.data);
            if (response.status === 200) {
                const groupedSchedule = groupScheduleByDay(response.data.teacherSchedule);
                setScheduleList(groupedSchedule);
            }
        } catch (error) {
            console.error("Error fetching schedule:", error);
        } finally {
            setLoading(false);
        }
    };

    const groupScheduleByDay = (scheduleList) => {
        return scheduleList.reduce((acc, schedule) => {
            const { dayOfWeek, startTime, endTime } = schedule;
            if (!acc[dayOfWeek]) {
                acc[dayOfWeek] = [];
            }
            acc[dayOfWeek].push({ startTime, endTime });
            return acc;
        }, {});
    };

    const handleModalOnClose = () => {
        onClose();
        closeModal();
    }

    const handleDeleteTeacher = async (teacherID) => {
        const token = sessionStorage.getItem('token');
        const newUrl = `${url}/delete/current/teacher?teacherID=${teacherID}`;
        setLoading(true);
        try {
            const response = await axios.delete(newUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (response.status === 200) {
                showSuccessMessage(response.data.message);
                handleModalOnClose();
            } else if (response.status === 202) {
                showErrorMessage(response.data.message);
            }
        } catch (error) {
            showErrorMessage('Something went wrong.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadWeeklySchedule(teacher.teacherID);
    }, [teacher.teacherID]);

    return (
        <div className='modal show'>
            <ToastContainer />
            <div className="view-teacher-modal">
                {loading === true ? (
                    <LoadingAnimation />
                ) : (
                    <>
                        <div className="teacher-header">
                            <h1>Viewing Teacher</h1>
                            <RiCloseLine onClick={handleModalOnClose} className='close-button' />
                        </div>
                        <div className="teacher-body">
                            <div className="personal">
                                <div className="personal-header">
                                    <h2>Personal Information</h2>
                                </div>
                                <div className="personal-container">
                                    <h3>Name: <span>{teacher.firstName} {teacher.lastName}</span></h3>
                                    <h3>Email: <span>{teacher.teacherEmail}</span></h3>
                                    <h3>Contact Number: <span>{teacher.contactNumber}</span></h3>
                                </div>
                            </div>
                            <div className="schedule">
                                <div className="schedule-header">
                                    <h2>Schedules</h2>
                                </div>
                                <div className="table-container">
                                    <table className="schedule-table">
                                        <thead>
                                            <tr>
                                                <th>Day</th>
                                                <th>Start Time</th>
                                                <th>End Time</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => {
                                                const schedules = scheduleList[day] || [];
                                                return (
                                                    <React.Fragment key={index}>
                                                        {schedules.length > 0 ? (
                                                            schedules.map((schedule, idx) => (
                                                                <tr key={idx}>
                                                                    {idx === 0 && <td rowSpan={schedules.length}>{day}</td>}
                                                                    <td>{schedule.startTime}</td>
                                                                    <td>{schedule.endTime}</td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td>{day}</td>
                                                                <td colSpan="2">No Schedules</td>
                                                            </tr>
                                                        )}
                                                    </React.Fragment>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="footer">
                            <Button_1 text="Delete" onClick={() => handleDeleteTeacher(teacher.teacherID)} />
                        </div>
                    </>
                )};
            </div>
        </div>
    )
}

export default ViewTeacherModal
