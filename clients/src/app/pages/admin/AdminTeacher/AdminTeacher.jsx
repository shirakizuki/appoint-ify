// IMPORT LIBRARY
import React from 'react';
import axios from 'axios'
// IMPORT HOOKS
import { ServerContext } from '../../../../context/ServerContext';
import { useState, useContext, useEffect } from 'react';
// IMPORT COMPONENTS
import Button from '../../../components/ButtonType2/Button'
import Profile from './Profile/Profile'
import Schedule from './Schedule/Schedule'
import Appointments from './Appointments/Appointments'
import TeacherForm from '../../../components/TeacherForm/TeacherForm';
// IMPOR CSS STYLINGS
import './AdminTeacher.css'

/**
 * The AdminTeacher component is used by the admin to view and manage
 * the list of teachers in a department. It displays a list of teachers
 * in the department and allows the admin to add, edit and remove teachers.
 * The component also displays the profile, schedule and appointments of
 * the currently selected teacher. The component interacts with the server
 * to load and save the list of teachers and to retrieve the profile, schedule
 * and appointments of the selected teacher.
 * 
 * @param {string} departmentID - The ID of the department whose teachers are to be managed.
 * @returns {React.ReactElement} The rendered AdminTeacher component.
 */
const AdminTeacher = ({departmentID}) => {
  const [showModal, setShow] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState('profile');
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const { url } = useContext(ServerContext);

  /**
   * Loads the list of teachers from the server for the given department ID.
   * Retrieves the authentication token from session storage and sends a GET request.
   * If successful, updates the teachers state with the retrieved list.
   * Also updates the selected teacher state to the previously selected teacher 
   * if present in the list, or defaults to the first teacher.
   * Logs an error message if the request fails.
   * 
   * @param {string} departmentID - The name of the department whose teachers are to be loaded.
   */
  const loadTeacher = async (departmentID) => {
    const token = sessionStorage.getItem('token');
    const newUrl = `${url}/loadteacherlist?departmentID=${encodeURIComponent(departmentID)}`;
    const response = await axios.get(newUrl, {
      headers: {
        'Authorization':`Bearer ${token}`
      }
    });
    if(response.status === 200) {
      const teacherList = response.data.teacherList;
      setTeachers(teacherList);
      if (selectedTeacher && teacherList.find(t => t.teacherID === selectedTeacher.teacherID)) {
        setSelectedTeacher(teacherList.find(t => t.teacherID === selectedTeacher.teacherID));
      } else {
        setSelectedTeacher(teacherList[0]);
      }
    }
  }

  /**
   * Function for handling teacher click event
   * @param {Object} teacher - Teacher object selected
   */
  const handleTeacherClick = (teacher) => {
    setSelectedTeacher(teacher);
  }

  useEffect(() => {
    loadTeacher(departmentID);
  }, [departmentID]);

  return (
    <div className='teachers'>
      <div className="section-left">
        {/* Left section of the page that contains the title and teacher list */}
        <div className="left-cont">
          <div className="title-cont">
            <h1>Teachers</h1>
          </div>
          <div className="separator">
            <hr className='sidebar-hr' />
          </div>
          {/* PRIMARY CONTAINER */}
          <div className="primary-cont">
            {/* Primary container that contains the add teacher button */}
            <p className='content-tag'>PRIMARY</p>
            <div className="content">
              <button className="cont-item" onClick={() => setShow(true)}>Add Teacher</button>
            </div>
          </div>
          <div className="separator">
            <hr className='sidebar-hr' />
          </div>
          <div className="teacher-cont">
            <p className='content-tag'>TEACHERS</p>
            <div className="content">
              {teachers.length === 0 ? (
                <p>No teachers available.</p>
              ) : (
                teachers.map(teacher => (
                  <button key={teacher.teacherID} className="cont-item" onClick={() => handleTeacherClick(teacher)}>
                    {teacher.firstName} {teacher.lastName}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="section-right">
        {/* Right section of the page that contains the teacher information */}
        {/* POP UP MODAL FOR ADDING */}
        {showModal && (
          <TeacherForm 
            closeModal={() => setShow(false)}
            departmentID={departmentID}
            onClose={() => loadTeacher(departmentID)}
          />
        )}
        <div className="teacher-information">
          {/* Container that contains the teacher information */}
          <div className="header">
            <h1>Teacher Profile</h1>
            {/* Delete teacher button */}
            <Button btn_name={'Delete Teacher'}/>
          </div>
          {/* Content menu that contains the profile and appointments tabs */}
          <div className="content-menu">
            <ul>
              <li><a onClick={() => setSelectedMenu('profile')}>Profile</a></li>
              <li><a onClick={() => setSelectedMenu('schedules')}>Schedule</a></li>
              <li><a onClick={() => setSelectedMenu('appointments')}>Appointments</a></li>
            </ul>
          </div>
          {/* Container that contains the teacher information based on the selected menu */}
          <div className="info-wrapper">
            {teachers.length === 0 ? (
              <p>This department has not added any teachers yet.</p>
            ) : (
              <>
                {selectedMenu === 'profile' && selectedTeacher && <Profile teacherID={selectedTeacher.teacherID} reloadTeacherData={() => loadTeacher(departmentID)}/>}
                {selectedMenu === 'appointments' && <Appointments />}
                {selectedMenu === 'schedules' && <Schedule teacherID={selectedTeacher.teacherID}/>}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminTeacher
