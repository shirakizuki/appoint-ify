// LIBRARY IMPORTS
import React from 'react';
import axios from 'axios';
// COMPONENT IMPORTS
import TimeDropDown from './TimeDropDown'
// HOOKS IMPORTS
import { ProgressSpinner } from 'primereact/progressspinner';
import { ToastContainer, toast } from "react-toastify";
import { useState, useEffect } from 'react';
// CSS IMPORT
import './TeacherSchedule.css'

const TeacherSchedule = ({ teacherID }) => {
    // STATES
    const [weeklySchedule, setWeeklySchedule] = useState({
        Monday: { available: false, slots: [{ startTime: '', endTime: '' }] },
        Tuesday: { available: false, slots: [{ startTime: '', endTime: '' }] },
        Wednesday: { available: false, slots: [{ startTime: '', endTime: '' }] },
        Thursday: { available: false, slots: [{ startTime: '', endTime: '' }] },
        Friday: { available: false, slots: [{ startTime: '', endTime: '' }] },
        Saturday: { available: false, slots: [{ startTime: '', endTime: '' }] },
        Sunday: { available: false, slots: [{ startTime: '', endTime: '' }] },
    });
    const [loading, setLoading] = useState(true);
    const [newSlots, setNewSlots] = useState({});
    const [updatedSlots, setUpdatedSlots] = useState({});
    const [removedSlots, setRemovedSlots] = useState([]);
    const [editWeekly, setEditWeekly] = useState(false);
    const url = import.meta.env.VITE_SERVER_API;

    const loadWeeklySchedule = async (teacherID) => {
        const token = sessionStorage.getItem('token')
        if (!teacherID) {
            console.log("No teacher ID provided");
            setLoading(false);
            return;
        }
        const newUrl = `${url}/read/current/teacher/weeklyschedule?teacherID=${encodeURIComponent(teacherID)}`;
        try {
            const response = await axios.get(newUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(response.status);
            if (response.status === 200) {
                const groupedSchedule = groupScheduleByDay(response.data.scheduleList);
                setWeeklySchedule(groupedSchedule);
                if (Object.keys(groupedSchedule).every(day => !groupedSchedule[day].available)) {
                    setWeeklyMessage('No weekly schedule found for this teacher.');
                }
            }
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const groupScheduleByDay = (scheduleList) => {
        const initialSchedule = {
            Monday: { available: false, slots: [] },
            Tuesday: { available: false, slots: [] },
            Wednesday: { available: false, slots: [] },
            Thursday: { available: false, slots: [] },
            Friday: { available: false, slots: [] },
            Saturday: { available: false, slots: [] },
            Sunday: { available: false, slots: [] },
        };

        return scheduleList.reduce((acc, schedule) => {
            const { dayOfWeek, startTime, endTime, scheduleID } = schedule; // Include scheduleID
            if (!acc[dayOfWeek]) {
                acc[dayOfWeek] = { available: true, slots: [] };
            }
            acc[dayOfWeek].available = true;
            acc[dayOfWeek].slots.push({
                startTime: startTime.slice(0, 5),
                endTime: endTime.slice(0, 5),
                scheduleID, // Add scheduleID here
            });
            return acc;
        }, initialSchedule);
    };

    const toggleAvailability = (day) => {
        setWeeklySchedule((prevSchedule) => {
            const updatedSchedule = {
                ...prevSchedule,
                [day]: {
                    ...prevSchedule[day],
                    available: !prevSchedule[day].available,
                },
            };

            if (!updatedSchedule[day].available) {
                newSlots[day] = [];
                updatedSlots[day] = [];
                removedSlots[day] = [];
            }
            return updatedSchedule;
        });
    };

    const handleAddSlot = (day) => {
        setNewSlots((prev) => ({
            ...prev,
            [day]: [...(prev[day] || []), { startTime: '00:00', endTime: '00:15' }]
        }));
    };

    const handleEditSlot = (day, index, field, value, isNewSlot) => {
        if (isNewSlot) {
            setNewSlots((prev) => {
                const updatedDaySlots = [...(prev[day] || [])];
                updatedDaySlots[index] = { ...updatedDaySlots[index], [field]: value };
                return { ...prev, [day]: updatedDaySlots };
            });
        } else {
            const oldSlot = weeklySchedule[day].slots[index];
            const newSlot = { ...oldSlot, [field]: value };

            setWeeklySchedule((prev) => ({
                ...prev,
                [day]: {
                    ...prev[day],
                    slots: prev[day].slots.map((slot, i) => (i === index ? newSlot : slot))
                }
            }));

            setUpdatedSlots((prev) => {
                const updatedDay = prev[day] || [];
                const existingIndex = updatedDay.findIndex(
                    (slot) => slot.oldStartTime === oldSlot.startTime && slot.oldEndTime === oldSlot.endTime
                );

                const updatedSlot = {
                    oldStartTime: oldSlot.startTime,
                    oldEndTime: oldSlot.endTime,
                    newStartTime: field === 'startTime' ? value : oldSlot.startTime,
                    newEndTime: field === 'endTime' ? value : oldSlot.endTime,
                };

                if (existingIndex > -1) {
                    updatedDay[existingIndex] = updatedSlot;
                } else {
                    updatedDay.push(updatedSlot);
                }

                return { ...prev, [day]: updatedDay };
            });
        }
    };

    const handleRemoveSlot = (day, index, isNewSlot, scheduleID) => {
        if (isNewSlot) {
            setNewSlots((prev) => ({
                ...prev,
                [day]: prev[day]?.filter((_, i) => i !== index) || []
            }));
        } else {
            const removedSlot = weeklySchedule[day].slots[index];
            setWeeklySchedule((prev) => ({
                ...prev,
                [day]: {
                    ...prev[day],
                    slots: prev[day].slots.filter((_, i) => i !== index)
                }
            }));
            setRemovedSlots((prev) => [
                ...prev,
                { scheduleID, startTime: removedSlot.startTime, endTime: removedSlot.endTime }
            ]);
        }
    };

    const handleCancelWeeklyEdit = () => {
        setNewSlots({});
        setUpdatedSlots({});
        setRemovedSlots([]);
        loadWeeklySchedule(teacherID);
        setEditWeekly(false);
    };

    const isValidTime = (startTime, endTime) => {
        const start = new Date(`1970-01-01T${startTime}:00Z`);
        const end = new Date(`1970-01-01T${endTime}:00Z`);
        return end > start;
    };

    const hasOverlappingSlots = (slots) => {
        for (let i = 0; i < slots.length; i++) {
            for (let j = i + 1; j < slots.length; j++) {
                const slot1 = slots[i];
                const slot2 = slots[j];
                const start1 = new Date(`1970-01-01T${slot1.startTime}:00Z`);
                const end1 = new Date(`1970-01-01T${slot1.endTime}:00Z`);
                const start2 = new Date(`1970-01-01T${slot2.startTime}:00Z`);
                const end2 = new Date(`1970-01-01T${slot2.endTime}:00Z`);
                if (start1 < end2 && start2 < end1) {
                    return true;
                }
            }
        }
        return false;
    };

    const hasDuplicateSlots = (existingSlots, newSlots) => {
        const slotSet = new Set();
        for (const slot of existingSlots) {
            const slotKey = `${slot.startTime}-${slot.endTime}`;
            if (slotSet.has(slotKey)) {
                return true;
            }
            slotSet.add(slotKey);
        }

        for (const slot of newSlots) {
            const slotKey = `${slot.startTime}-${slot.endTime}`;
            if (slotSet.has(slotKey)) {
                return true;
            }
            slotSet.add(slotKey);
        }

        return false;
    };

    const handleSaveWeeklyEdit = async () => {
        for (const day in weeklySchedule) {
            const allSlots = [...weeklySchedule[day].slots, ...(newSlots[day] || [])];

            for (const slot of allSlots) {
                const { startTime, endTime } = slot;

                if (!startTime || !endTime) {
                    showErrorMessage(`${day} both start and end time must be provided.`);
                    return;
                }

                if (!isValidTime(startTime, endTime)) {
                    showErrorMessage(`${day} has invalid time slots.`);
                    return;
                }
            }

            if (hasDuplicateSlots(weeklySchedule[day].slots, newSlots[day] || [])) {
                showErrorMessage(`${day} has duplicate time slots.`);
                return;
            }

            if (hasOverlappingSlots(allSlots)) {
                showErrorMessage(`${day} has overlapping time slots.`);
                return;
            }
        }

        const flattenedNewSlots = Object.keys(newSlots).map(day => ({
            dayOfWeek: day,
            slots: newSlots[day],
        }));

        const flattenedUpdatedSlots = Object.keys(updatedSlots).map(day => ({
            dayOfWeek: day,
            slots: updatedSlots[day],
        }));
        setLoading(true);
        try {
            const token = sessionStorage.getItem('token')
            const response = await axios.post(`${url}/create/current/teacher/schedule`, {
                teacherID,
                newSlots: flattenedNewSlots,
                updatedSlots: flattenedUpdatedSlots,
                removedSlots,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                loadWeeklySchedule(teacherID);
                setNewSlots({});
                setRemovedSlots([]);
                setUpdatedSlots({});
                setEditWeekly(false);
                showSuccessMessage('Schedule saved successfully.');
            } else {
                showErrorMessage('Failed to save schedule.');
            }
        } catch (error) {
            showErrorMessage('Failed to save schedule.');
            throw error;
        } finally {
            setEditWeekly(false);
        }
    };

    useEffect(() => {
        if (teacherID) {
            setLoading(true);
            setEditWeekly(false);
            loadWeeklySchedule(teacherID);
        } else {
            setLoading(false);
        }
    }, [teacherID]);

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

    return (
        <div className="wrap">
            <ToastContainer />
            {loading === true ? (
                <ProgressSpinner />
            ) : (
                <div className="wrapper" id='weekly-wrap'>
                    <div className="wrap-header">
                        <h2>Weekly Schedule</h2>
                    </div>
                    <div className="wrap-content">
                        {editWeekly ? (
                            <div className='wrap-items'>
                                {Object.keys(weeklySchedule).map((day) => (
                                    <div key={day} className='item'>
                                        <div className="left">
                                            <input type="checkbox" checked={weeklySchedule[day].available} onChange={() => toggleAvailability(day)} />
                                            <span>{day}</span>
                                        </div>
                                        {weeklySchedule[day]?.available ? (
                                            <>
                                                <div className="center">
                                                    {weeklySchedule[day].slots.length > 0 && (
                                                        weeklySchedule[day].slots.map((slot, index) => (
                                                            <div key={index} className="inputs">
                                                                <TimeDropDown value={slot.startTime} onChange={(value) => handleEditSlot(day, index, 'startTime', value, false)} />
                                                                <TimeDropDown value={slot.endTime} onChange={(value) => handleEditSlot(day, index, 'endTime', value, false)} />
                                                                <button onClick={() => handleRemoveSlot(day, index, false, slot.scheduleID)}>X</button> {/* Pass scheduleID */}
                                                            </div>
                                                        ))
                                                    )}
                                                    {newSlots[day]?.map((slot, index) => (
                                                        <div key={index} className="inputs">
                                                            <TimeDropDown value={slot.startTime} onChange={(value) => handleEditSlot(day, index, 'startTime', value, true)} valueName={'Start Time'} />
                                                            <TimeDropDown value={slot.endTime} onChange={(value) => handleEditSlot(day, index, 'endTime', value, true)} valueName={'End Time'} />
                                                            <button onClick={() => handleRemoveSlot(day, index, true)}>X</button>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="right">
                                                    <button onClick={() => handleAddSlot(day)}>+</button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="center">
                                                <p>Unavailable</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className='wrap-items'>
                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                                    <div key={day} className='item'>
                                        <div className="left">
                                            <span>{day}</span>
                                        </div>
                                        <div className="center">
                                            {weeklySchedule[day]?.available ? (
                                                weeklySchedule[day].slots.length > 0 && (
                                                    weeklySchedule[day].slots.map((timeSlot, index) => (
                                                        <span key={index}>{timeSlot.startTime} - {timeSlot.endTime}</span>
                                                    ))
                                                )
                                            ) : (
                                                <p>Unavailable</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="wrap-footer">
                        {editWeekly ? (
                            <div className='btn-cont'>
                                <button className='btn12' onClick={handleSaveWeeklyEdit}>Save</button>
                                <button className='btn12' onClick={handleCancelWeeklyEdit}>Cancel</button>
                            </div>
                        ) : (
                            <button className='btn12' onClick={() => setEditWeekly(true)}>Edit Schedule</button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default TeacherSchedule;