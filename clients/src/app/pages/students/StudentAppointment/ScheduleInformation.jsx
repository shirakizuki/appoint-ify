import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import { ServerContext } from '../../../../context/ServerContext';

import './FormInput.css';

const ScheduleInformation = ({ formData, setFormData, activeStep, steps, setActiveStep }) => {
  const [scheduleList, setScheduleList] = useState([]);
  const [dateRange, setDateRange] = useState([]);
  const [errors, setErrors] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [availableDurations, setAvailableDurations] = useState([]);
  const { url } = useContext(ServerContext);

  const calculateDateRange = () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 2);
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const options = { month: 'short', day: '2-digit' };
      const formattedDate = date.toLocaleString('en-US', options).replace(',', '');

      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');

      const fullDate = `${yyyy}-${mm}-${dd}`;

      return {
        short: formattedDate,
        full: fullDate
      };
    });
  };

  const loadScheduleList = async (teacherID, inputDate) => {
    try {
      const newUrl = `${url}/appointment/schedulelist?teacherID=${encodeURIComponent(teacherID)}&inputDate=${encodeURIComponent(inputDate)}`;
      const response = await axios.get(newUrl);
      if (response.status === 200 && Array.isArray(response.data.scheduleSlot)) {
        setScheduleList(response.data.scheduleSlot[0] || []);
      } else {
        console.error('Failed to load schedule slots:', response.data.error);
        setScheduleList([]);
      }
    } catch (error) {
      throw error;
    }
  };

  const loadDuration = async (scheduleID, selectedDate) => {
    console.log(scheduleID, selectedDate);
    try {
      const newUrl = `${url}/appointment/durationfunc?scheduleID=${encodeURIComponent(scheduleID)}&selectedDate=${encodeURIComponent(selectedDate)}`;
      const response = await axios.get(newUrl);
      if (response.status === 200) {
        const remainingDuration = response.data.result[0]?.remainingDuration || 0;
        setAvailableDurations([15, 30, 45, 60].filter((interval) => interval <= remainingDuration));
      } else {
        console.error('Error loading available durations.');
      }
    } catch (error) {
      console.error('Error fetching available durations:', error);
    }
  };

  const handleDateChange = (e) => {
    const fullDate = e.target.value;
    setFormData((prev) => ({
      ...prev,
      appointmentDate: fullDate,
      scheduleID: null,
      scheduleSlot: null,
      appointmentDuration: null,
    }));
    setScheduleList([]);
    setAvailableDurations([]);
    loadScheduleList(formData.teacherID, fullDate);
  };

  const handleSlotChange = (e) => {
    const scheduleID = e.target.value;
    const selectedSlot = scheduleList.find((slot) => slot.scheduleID === parseInt(scheduleID, 10));
  
    setFormData((prev) => ({
      ...prev,
      scheduleID,
      scheduleSlot: selectedSlot ? `${selectedSlot.startTime.slice(0, 5)} - ${selectedSlot.endTime.slice(0, 5)}` : '',
      appointmentDuration: '',
    }));
    setAvailableDurations([]);
  };

  const handleDurationChange = (e) => {
    setFormData((prev) => ({ ...prev, appointmentDuration: e.target.value }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.appointmentDate) {
      errors.appointmentDate = 'Appointment date is required.';
    }

    if (!formData.scheduleID && scheduleList.length > 0) {
      errors.scheduleID = 'Appointment time is required.';
    }

    if (!formData.scheduleSlot && formData.appointmentDate) {
      errors.scheduleID = 'Appointment time is required.';
    }
    
    if ((!formData.appointmentDuration || availableDurations.length === 0) && scheduleList.length > 0) {
      errors.appointmentDuration = 'Appointment duration is required.';
    }
    
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateForm() && activeStep < steps.length - 1) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prev) => prev - 1);
    }
  };

  useEffect(() => {
    const dates = calculateDateRange();
    setDateRange(dates);
  }, [setFormData]);

  useEffect(() => {
    if (formData.appointmentDate && formData.teacherID) {
      loadScheduleList(formData.teacherID, formData.appointmentDate);
    }
  }, [formData.appointmentDate, formData.teacherID]);

  useEffect(() => {
    if (formData.scheduleID && formData.appointmentDate) {
      loadDuration(formData.scheduleID, formData.appointmentDate);
    }
  }, [formData.scheduleID, formData.appointmentDate]);

  return (
    <div className="contentForm scheduleForm">
      <div className="header">
        <h1>Pick a Schedule</h1>
      </div>
      <div className="body">
        {/* Date Picker */}
        <div className="inputField">
          <label>Appointment Date:</label>
          <div className="inputCont">
            <select name="appointmentDate" id="appointmentDate" value={formData.appointmentDate || ''} onChange={handleDateChange}>
              <option value="" disabled>Select appointment date</option>
              {dateRange.map((date, index) => (
                <option key={index} value={date.full}>{date.short}</option>
              ))}
            </select>
            {errors.appointmentDate && <span className="error">{errors.appointmentDate}</span>}
          </div>
        </div>
        {/* Time Picker */}
        <div className="inputField">
          <label>Appointment Time:</label>
          <div className="inputCont">
            {scheduleList.length > 0 ? (
              <select name="scheduleSlot" id="scheduleSlot" value={formData.scheduleID || ''} onChange={handleSlotChange}>
                <option value="" disabled>Select appointment time</option>
                {scheduleList.map((slot) => (
                  <option key={slot.scheduleID} value={slot.scheduleID}>
                    {slot.startTime.slice(0, 5)} - {slot.endTime.slice(0, 5)}
                  </option>
                ))}
              </select>
            ) : (
              <p>No available slots</p>
            )}
            {errors.scheduleID && <span className="error">{errors.scheduleID}</span>}
          </div>
        </div>
        {/* Duration Picker */}
        <div className="inputField">
          <label>Available Duration:</label>
          <div className="inputCont">
            {availableDurations.length > 0 ? (
              <select name="appointmentDuration" id="appointmentDuration" value={formData.appointmentDuration || ''} onChange={handleDurationChange}>
                <option value="" disabled>Select appointment duration</option>
                {availableDurations.map((duration, index) => (
                  <option key={index} value={duration}>
                    {duration} minutes
                  </option>
                ))}
              </select>
            ) : (
              <p>The selected slot is fully booked.</p>
            )}
            {errors.duration && <span className="error">{errors.duration}</span>}
          </div>
        </div>
      </div>
      <div className="safooter">
        <button onClick={handleBack} disabled={activeStep === 0} className="formButton">Back</button>
        <button onClick={handleNext} disabled={activeStep === steps.length - 1} className="formButton">Continue</button>
      </div>
    </div>
  );
};

export default ScheduleInformation;