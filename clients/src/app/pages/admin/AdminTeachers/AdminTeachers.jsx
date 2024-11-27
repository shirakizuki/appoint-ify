import React from 'react'
import axios from 'axios'

import { useLocation } from 'react-router-dom'
import { ServerContext } from '../../../../context/ServerContext'
import { useState, useEffect, useContext } from 'react'

import AdminNavbar from '../../../components/Navbar/AdminNavbar'
import TeacherModal from '../../../components/modal/TeacherModal/TeacherModal'

import './AdminTeachers.css'

const AdminTeachers = () => {
  const departmentID = useLocation().state?.departmentID;
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [teacherAppointments, setAppointmentList] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [scheduleList, setScheduleList] = useState([]);
  const [showModal, setShow] = useState(false);
  const { url } = useContext(ServerContext);

  // Load teachers by departmentID
  const loadTeacher = async (departmentID) => {
    const token = sessionStorage.getItem('token');
    const newUrl = `${url}/loadteacherlist?departmentID=${encodeURIComponent(departmentID)}`;
    const response = await axios.get(newUrl, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.status === 200) {
      const teacherList = response.data.teacherList;
      setTeachers(teacherList);
      if (selectedTeacher && teacherList.find(t => t.teacherID === selectedTeacher.teacherID)) {
        setSelectedTeacher(teacherList.find(t => t.teacherID === selectedTeacher.teacherID));
      } else {
        setSelectedTeacher(teacherList[0]);
      }
    }
  }

  // Load teacher's weekly schedule
  const loadWeeklySchedule = async (teacherID) => {
    const token = sessionStorage.getItem('token');
  
    if (!teacherID) {
      console.log("No teacher ID provided");
      return;
    }
  
    const newUrl = `${url}/loadweeklyschedule?teacherID=${encodeURIComponent(teacherID)}`;
    try {
      const response = await axios.get(newUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log(response.data);
      if (response.status === 200) {
        const groupedSchedule = groupScheduleByDay(response.data.scheduleList);
        setScheduleList(groupedSchedule);
      }
    } catch (error) {
      console.error("Error fetching schedule:", error);
    }
  };

  // Group schedule by day of the week
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

  // Load teacher's appointments
  const loadAppointments = async (teacherID) => {
    const token = sessionStorage.getItem('token');
    const newUrl = `${url}/loadappointmentlist?departmentID=null&teacherID=${encodeURIComponent(teacherID)}`;
    try {
      const response = await axios.get(newUrl, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        setAppointmentList(response.data.result);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  }

  // Format date
  const dateFormatter = (date) => {
    const newDate = new Date(date);
    const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
    const formattedDate = newDate.toLocaleDateString('en-PH', options);
    return formattedDate;
  }

  // Load teacher list when departmentID changes
  useEffect(() => {
    loadTeacher(departmentID);
  }, [departmentID]);

  // Load appointments and schedule when a teacher is selected
  useEffect(() => {
    if (selectedTeacher) {
      loadAppointments(selectedTeacher.teacherID);
      loadWeeklySchedule(selectedTeacher.teacherID);
    }
  }, [selectedTeacher]);

  return (
    <>
      <AdminNavbar departmentID={departmentID} />
      <section className="adminTeachers">
        {showModal && (
          <TeacherModal closeModal={() => setShow(false)} departmentID={departmentID} onClose={() => loadTeacher(departmentID)} />
        )}
        <div className="body">
          <div className="teacherListCont">
            <div className='ttle'>
              <p>Main Action</p>
              <button className='btn07' onClick={() => setShow(true)}>Add Teachers</button>
            </div>
            <div>
              <p>Teacher List</p>
              <div className="list">
                {teachers.map((teacher) => (
                  <li key={teacher.teacherID}><a onClick={() => setSelectedTeacher(teacher)}>{teacher.firstName} {teacher.lastName}</a></li>
                ))}
              </div>
            </div>
          </div>
          <div className="teacherInfoPanel">
            {selectedTeacher && (
              <div className="selectedTeacher">
                <div className="header">
                  <h1 className='name'>{selectedTeacher.firstName} {selectedTeacher.lastName}</h1>
                  <div>
                    <p>{selectedTeacher.teacherEmail}</p>
                    <p>{selectedTeacher.contactNumber}</p>
                  </div>
                </div>
                <div className="body">
                  <div className="schedule">
                    <div className="header">
                      <h2>Schedules</h2>
                    </div>
                    <div className="scheduleTable">
                      <table>
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
                  <div className="appointments">
                    <div className="header">
                      <h2>Appointments</h2>
                    </div>
                    <div className="appointmentTable">
                      <table>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Duration</th>
                            <th>Reference Code</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {teacherAppointments.map((appointment) => (
                            <tr key={appointment.appointmentID}>
                              <td>{dateFormatter(appointment.appointmentDate)}</td>
                              <td>{appointment.appointmentDuration} minutes</td>
                              <td>{appointment.referenceCode}</td>
                              <td>
                                <span
                                  style={{
                                    color:
                                      appointment.appointmentStatus === 'Pending'
                                        ? 'orange'
                                        : appointment.appointmentStatus === 'Declined'
                                          ? 'red'
                                          : 'green',
                                  }}
                                >
                                  {appointment.appointmentStatus}
                                </span>
                              </td>
                              <td>
                                <button className="btn03 view">View</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

export default AdminTeachers