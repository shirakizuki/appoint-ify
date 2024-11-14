/**
 * Component to display the weekly schedule of a teacher.
 * The component takes in a prop 'teacherID' which is the ID of the teacher.
 * The component displays the weekly schedule of the teacher in a table format.
 * The component also allows the user to add, edit and remove slots from the schedule.
 * The component updates the weekly schedule in the server when the user adds, edits or removes slots.
 * @param {String} teacherID - The ID of the teacher
 */
// IMPORT STATEMENTS
// LIBRARY IMPORTS
import React from 'react';
import axios from 'axios';
// COMPONENT IMPORTS
import Button from '../../../components/ButtonType3/Button'
import TimeDropDown from '../../../components/TimeDropDown/TimeDropDown'
// HOOKS IMPORTS
import { ServerContext } from '../../../../context/ServerContext';
import { useState, useContext, useEffect } from 'react';
// CSS IMPORT
import './TeacherSchedule.css'

/**
 * The TeacherSchedule component allows teachers to view and manage their weekly schedule.
 * It displays the schedule in a table format and provides functionalities to add, edit,
 * and remove time slots for each day of the week. The component interacts with the server
 * to load and save schedule data and ensures the validation of time slots before saving.
 * It manages states for the weekly schedule, loading status, new slots, updated slots,
 * removed slots, edit mode, and error messages. The component uses the teacherID prop
 * to identify the teacher whose schedule is being managed.
 * 
 * @param {Object} props - The properties object.
 * @param {string} props.teacherID - The ID of the teacher whose schedule is to be managed.
 * @returns {React.ReactElement} The rendered TeacherSchedule component.
 */
const TeacherSchedule = ({ teacherID }) => {
    // STATES
    const [weeklySchedule, setWeeklySchedule] = useState({ // State to store the weekly schedule
        Monday: { available: false, slots: [{ startTime: '', endTime: '' }] },
        Tuesday: { available: false, slots: [{ startTime: '', endTime: '' }] },
        Wednesday: { available: false, slots: [{ startTime: '', endTime: '' }] },
        Thursday: { available: false, slots: [{ startTime: '', endTime: '' }] },
        Friday: { available: false, slots: [{ startTime: '', endTime: '' }] },
        Saturday: { available: false, slots: [{ startTime: '', endTime: '' }] },
        Sunday: { available: false, slots: [{ startTime: '', endTime: '' }] },
    });
    const [loading, setLoading] = useState(true); // Loading state
    const [newSlots, setNewSlots] = useState({}); // State to store the new slots
    const [updatedSlots, setUpdatedSlots] = useState({}); // State to store the updated slots
    const [removedSlots, setRemovedSlots] = useState([]); // State to store the removed slots
    const [editWeekly, setEditWeekly] = useState(false); // State to store whether the weekly schedule is being edited
    const [errors, setErrors] = useState({}); // State to store errors
    // CONTEXT OBJECT
    const { url } = useContext(ServerContext); // Retrieve URL from AdminContext

    /**
     * Loads the weekly schedule for the given teacher ID.
     * If no teacher ID is given, nothing is done.
     * The weekly schedule is retrieved from the server and stored in the state.
     * If the teacher has no weekly schedule, a message is displayed.
     * If there is an error, an error message is logged.
     * @param {string} teacherID - The ID of the teacher to load the schedule for
     */
    const loadWeeklySchedule = async (teacherID) => {
        const token = sessionStorage.getItem('token')
        if (!teacherID) {
            console.log("No teacher ID provided");
            setLoading(false);
            return;
        }
        const newUrl = `${url}/loadweeklyschedule?teacherID=${encodeURIComponent(teacherID)}`;
        try {
            const response = await axios.get(newUrl, {
                headers: {
                  'Authorization':`Bearer ${token}`
                }
            });
            console.log(response.data);
            if (response.data.status === 'success') {
                const groupedSchedule = groupScheduleByDay(response.data.scheduleList);
                setWeeklySchedule(groupedSchedule);
                if (Object.keys(groupedSchedule).every(day => !groupedSchedule[day].available)) {
                    setWeeklyMessage('No weekly schedule found for this teacher.');
                } else {
                    console.log(groupedSchedule);
                }
            }
        } catch (error) {
            console.error('Error loading weekly schedule:', error);
            console.log('Error response:', error.response?.data);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Groups a list of schedules by day of the week.
     * The input is an array of objects with the following properties:
     * - dayOfWeek (string): The day of the week (e.g., Monday)
     * - startTime (string): The start time of the schedule in the format HH:mm
     * - endTime (string): The end time of the schedule in the format HH:mm
     * - scheduleID (string): The ID of the schedule
     * The output is an object with the day of the week as the key and an object with the following properties:
     * - available (boolean): Whether the teacher is available on that day
     * - slots (array): An array of objects with the following properties:
     *   - startTime (string): The start time of the schedule in the format HH:mm
     *   - endTime (string): The end time of the schedule in the format HH:mm
     *   - scheduleID (string): The ID of the schedule
     * @param {Object[]} scheduleList - The list of schedules to group
     * @returns {Object} - The grouped schedule
     */
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

    /**
     * Toggles the availability of a teacher on a given day of the week. If the teacher is unavailable on that day,
     * all new slots, updated slots, and removed slots for that day are cleared.
     * @param {string} day - The day of the week to toggle availability (e.g., Monday)
     */
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

    /**
     * Adds a new time slot to the specified day in the new slots state.
     * The new slot is initialized with a default start time of '00:00' and an end time of '00:15'.
     * 
     * @param {string} day - The day of the week to add the slot to (e.g., 'Monday').
     */
    const handleAddSlot = (day) => {
        setNewSlots((prev) => ({
            ...prev,
            [day]: [...(prev[day] || []), { startTime: '00:00', endTime: '00:15' }]
        }));
    };

    /**
     * Updates a time slot in either the new slots state or the updated slots state.
     * If the slot is in the new slots state, it is updated in place.
     * If the slot is in the existing schedule, a new entry is created in the updated slots state.
     * The error state is also reset.
     * @param {string} day - The day of the week the slot belongs to (e.g., 'Monday').
     * @param {number} index - The index of the slot in the day's slots array.
     * @param {string} field - The field of the slot to update (either 'startTime' or 'endTime').
     * @param {string} value - The new value of the slot's field.
     * @param {boolean} isNewSlot - Whether the slot is in the new slots state or the existing schedule.
     */
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
        setErrors({});
    };   

    /**
     * Removes a time slot from the schedule for a specified day.
     * 
     * If the slot is a new slot, it is removed from the new slots state.
     * If the slot is an existing slot, it is removed from the weekly schedule
     * and added to the removed slots state with its scheduleID, startTime, and endTime.
     * 
     * @param {string} day - The day of the week from which the slot should be removed.
     * @param {number} index - The index of the slot to be removed.
     * @param {boolean} isNewSlot - A flag indicating whether the slot is a new slot or an existing slot.
     * @param {string} scheduleID - The unique identifier of the slot in the weekly schedule (used only if the slot is an existing slot).
     */
    const handleRemoveSlot = (day, index, isNewSlot, scheduleID) => {
        if (isNewSlot) {
            setNewSlots((prev) => ({
                ...prev,
                [day]: prev[day]?.filter((_, i) => i !== index) || []
            }));
            console.log(`Remove new slot with index ${index} from new slots for day ${day}`);
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
            console.log(`Remove existing slot with index ${index} and scheduleID ${scheduleID} from weekly schedule for day ${day}`);
        }
    };    

    /**
     * Cancels the weekly schedule edit. Resets new slots, updated slots, and removed slots to empty,
     * clears errors, reloads the weekly schedule for the current teacher, and sets editWeekly to false.
     */
    const handleCancelWeeklyEdit = () => {
        setNewSlots({});
        setUpdatedSlots({});
        setRemovedSlots([]);
        setErrors({});
        loadWeeklySchedule(teacherID);
        setEditWeekly(false);
    };
    
    /**
     * Saves the weekly schedule for the current teacher. Validates time slots for each day
     * by checking for valid start and end times, duplicate slots, and overlapping slots.
     * If validation passes, sends a request to save new, updated, and removed slots to the server.
     * On success, reloads the weekly schedule and resets the edit state. Displays errors if saving fails.
     */
    const handleSaveWeeklyEdit = async () => {
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
    
        for (const day in weeklySchedule) {
            const allSlots = [...weeklySchedule[day].slots, ...(newSlots[day] || [])];
        
            // Validate startTime and endTime for each slot
            for (const slot of allSlots) {
                const { startTime, endTime } = slot;
        
                if (!startTime || !endTime) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        [day]: 'Invalid time: Both start and end time must be provided.',
                    }));
                    return;
                }                
        
                if (!isValidTime(startTime, endTime)) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        [day]: 'Invalid time: Start time must be before end time.',
                    }));
                    return;
                }                
            }
        
            if (hasDuplicateSlots(weeklySchedule[day].slots, newSlots[day] || [])) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [day]: 'There are duplicate time slots.',
                }));
                return;
            }
        
            if (hasOverlappingSlots(allSlots)) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    [day]: 'There are overlapping time slots.',
                }));
                return;
            }
        }
    
        // Flatten the new and updated slots for the API call
        const flattenedNewSlots = Object.keys(newSlots).map(day => ({
            dayOfWeek: day,
            slots: newSlots[day],
        }));
    
        const flattenedUpdatedSlots = Object.keys(updatedSlots).map(day => ({
            dayOfWeek: day,
            slots: updatedSlots[day],
        }));
    
        try {
            const response = await axios.post(`${url}/updateweeklyschedule`, {
                teacherID,
                newSlots: flattenedNewSlots,
                updatedSlots: flattenedUpdatedSlots,
                removedSlots,
            }, {
                headers: {
                  'Authorization':`Bearer ${token}`
                }
            });
    
            if (response.data.status === 'success') {
                loadWeeklySchedule(teacherID);
                setNewSlots({});
                setRemovedSlots([]);
                setUpdatedSlots({});
                setErrors({});
                setEditWeekly(false);
            } else {
                alert('Failed to save schedule.');
            }
        } catch (error) {
            console.error('Error saving weekly schedule:', error);
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

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!teacherID) {
        return <div>No teacher found. Please check your account settings.</div>;
    }

    return (
        <div className="wrap">
            {/* WEEKLY SCHEDULE */}
            <div className="wrapper" id='weekly-wrap'>
                <div className="wrap-header">
                    <h2>Weekly Schedule</h2>
                </div>
                <div className="wrap-content">
                    {editWeekly ? (
                        <div className='wrap-items'>
                            {Object.keys(weeklySchedule).map((day) => (
                                <>
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
                                                                <TimeDropDown value={slot.startTime} onChange={(value) => handleEditSlot(day, index, 'startTime', value, false)}/>
                                                                <TimeDropDown value={slot.endTime} onChange={(value) => handleEditSlot(day, index, 'endTime', value, false)} />
                                                                <button onClick={() => handleRemoveSlot(day, index, false, slot.scheduleID)}>X</button> {/* Pass scheduleID */}
                                                            </div>
                                                        ))
                                                    )}
                                                    {newSlots[day]?.map((slot, index) => (
                                                        <div key={index} className="inputs">
                                                            <TimeDropDown value={slot.startTime} onChange={(value) => handleEditSlot(day, index, 'startTime', value, true)} valueName={'Start Time'}/>
                                                            <TimeDropDown value={slot.endTime} onChange={(value) => handleEditSlot(day, index, 'endTime', value, true)} valueName={'End Time'}/>
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
                                    {errors[day] && <p className='p-error'>* {errors[day]}</p>}
                                </>
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
                        <>
                            <Button btn_name={'Save'} onClick={handleSaveWeeklyEdit}/>
                            <Button btn_name={'Cancel'} onClick={handleCancelWeeklyEdit}/>
                        </>
                    ) : (
                        <Button btn_name={'Edit Schedule'} onClick={() => setEditWeekly(true)}/>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TeacherSchedule;