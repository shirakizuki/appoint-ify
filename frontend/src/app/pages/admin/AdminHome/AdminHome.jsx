// IMPORT LIBRARY
import React from 'react';
import axios from 'axios'
// IMPORT HOOKS
import { useNavigate } from 'react-router-dom';
import { ServerContext } from '../../../../context/ServerContext';
import { useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
// IMPORT COMPONENTS
import Button from '../../../components/ButtonType2/Button'
import Sidebar from '../../../components/Sidebar/Sidebar';
import AdminDashboard from '../AdminDashboard/AdminDashboard'
import AdminCalendar from '../AdminCalendar/AdminCalendar'
import AdminAppointment from '../AdminAppointment/AdminAppointment'
import AdminTeacher from '../AdminTeacher/AdminTeacher'
// IMPOR CSS STYLINGS
import './AdminHome.css'

const AdminHome = () => {
  const departmentID = useLocation().state?.departmentID;
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('Dashboard')
  const handleItemClick = (itemName) => {
    setActiveItem(itemName)
  }
  /**
   * Renders the content based on the activeItem state
   * @function
   * @returns {JSX.Element} The rendered content
   */
  const renderContent = () => {
    switch (activeItem) {
      case 'DASHBOARD':
        return <AdminDashboard />
      case 'APPOINTMENT':
        return <AdminAppointment />
      case 'CALENDAR':
        return <AdminCalendar />
      case 'TEACHERS':
        return <AdminTeacher departmentID={departmentID}/>
      default:
        return <AdminDashboard />
    }
  }
  return (
    <div className='adminHome'>
      <Sidebar activeItem={activeItem} handleItemClick={handleItemClick} />
      <div className='active-content'>
        {renderContent()}
      </div>
    </div>
  )
}

export default AdminHome
