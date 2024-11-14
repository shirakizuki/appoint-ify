// IMPORT LIBRARY
import React from 'react';
// IMPORT HOOKS
import { useLocation } from 'react-router-dom';
// IMPORT COMPONENTS
import TeacherNavbar from '../../../components/Navbar/TeacherNavbar/TeacherNavbar'
// IMPOR CSS STYLINGS
import './TeacherHomepage.css'

const TeacherHomepage = () => {
    const teacherID = useLocation().state?.teacherID;
    return (
        <div>
            <TeacherNavbar teacherID={teacherID}/>
            <main>
                
            </main>
        </div>
    )
}

export default TeacherHomepage
