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
        <>
            <TeacherNavbar teacherID={teacherID}/>
            <main>
                
            </main>
        </>
    )
}

export default TeacherHomepage
