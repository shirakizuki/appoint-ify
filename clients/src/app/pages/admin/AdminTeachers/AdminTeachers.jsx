import React from 'react'

import { useLocation } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'

import AdminNavbar from '../../../components/Navbar/AdminNavbar'
import TeacherModal from '../../../components/modal/TeacherModal/TeacherModal'

import './AdminTeachers.css'

const AdminTeachers = () => {
  const departmentID = useLocation().state?.departmentID;
  const [showModal, setShow] = useState(false);

  return (
    <>
      <AdminNavbar departmentID={departmentID} />
      <section className="adminTeachers">
        {showModal && (
          <TeacherModal closeModal={() => setShow(false)} departmentID={departmentID} />
        )}
        <div className="header">
          <h1>Teachers</h1>
          <div className="navigators">
            <button className='btn07' onClick={() => setShow(true)}>Add Teachers</button>
          </div>
        </div>
      </section>
    </>
  )
}

export default AdminTeachers
