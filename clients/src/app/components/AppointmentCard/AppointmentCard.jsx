import React from 'react'

import { useState, useEffect } from 'react'

import './AppointmentCard.css'

const AppointmentCard = ({appointment}) => {
  const [seeMore, setSeeMore] = useState(false);
  const [status, setStatus] = useState('');

  const dateFormatter = (date) => {
    const newDate  = new Date(date);
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    const formattedDate = newDate.toLocaleDateString('en-PH', options);

    return formattedDate;
  }

  const {
    appointmentID,
    departmentID,
    appointmentDate,
    scheduleID,
    referenceCode,
    appointmentPurpose,
    appointmentDuration,
    appointmentStatus,
    startTime,
    endTime,
    teacherName,
  } = appointment;

  // PENDING - Orange,
  // CANCELLED - Red,
  // COMPLETED - Green

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'orange';
      case 'Cancelled':
        return 'red';
      case 'Completed':
        return 'green';
      default:
        return 'black';
    }
  };

  useEffect(() => {
    setStatus(appointmentStatus);
  }, [appointmentStatus]);

  return (
    <div className="appointmentCard">
      <div className="cardContainer">
        <div className="cardLeft">
          <div className="scheduleBlck">
            <p>Start</p>
            <h1>{startTime.slice(0, 5)}</h1>
          </div>
          <div className="scheduleBlck">
            <p>End</p>
            <h1>{endTime.slice(0, 5)}</h1>
          </div>
        </div>
        <div className="cardRight">
          <div className="header">
            <h1>{referenceCode} - <span style={{ color: getStatusColor(appointmentStatus) }}>{appointmentStatus}</span></h1>
            <button className="btn05" onClick={() => setSeeMore(!seeMore)}>
              {seeMore ? 'See Less' : 'See More'}
            </button>
          </div>
          <div className={`body ${seeMore ? 'show' : ''}`}>
            <div className="blck">
              <p>Duration</p>
              <h3>{appointmentDuration} minutes</h3>
            </div>
            <div className="blck">
              <p>Date</p>
              <h3>{dateFormatter(appointmentDate)}</h3>
            </div>
            <div className="blck">
              <p>Teacher</p>
              <h3>{teacherName}</h3>
            </div>
          </div>
          <div className={`footer ${seeMore ? 'show' : ''}`}>
            <button className="btn03 reschedule">View Details</button>
            <button className="btn03 cancel">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard
