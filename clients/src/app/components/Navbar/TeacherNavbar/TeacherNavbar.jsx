// IMPORT LIBRARY
import React from 'react'
import useSignOut from 'react-auth-kit/hooks/useSignOut'
// IMPORT HOOKS
import { def_assets } from '../../../../assets/assets'
import { useNavigate } from 'react-router-dom'
// IMPORT CSS STYLINGS
import './TeacherNavbar.css'

/**
 * The NavbarHome component renders a navigation bar for the teacher home page.
 *
 * This component includes a title section with an image and a main title,
 * as well as navigation links for 'Home', 'Settings', and a 'Logout' button.
 * The navigation links trigger different navigation functions when clicked.
 *
 * @param {number} teacherID the ID of the teacher
 * @returns {React.ReactElement} The rendered navigation bar component.
 */
const NavbarHome = ({ teacherID }) => {
    const navigate = useNavigate();
    const signOut = useSignOut();
    
    /**
     * Logs out the user by clearing the session and local storage and 
     * navigating to the root route.
     * 
     * This function is called when the user clicks the 'Logout' button in the
     * teacher navigation bar.
     */
    const logout = () => {
        signOut()
        localStorage.clear()
        sessionStorage.clear()
        navigate('/')
    }
    
    return (
        <div className='navbarTeacher'>
            <div className="titleContainer">
                <img src={def_assets.appointify_logo} alt='appointment_logo' />
            </div>
            <div className="navigators">
                <ul>
                    <li><a onClick={() => navigate('/teacher/home', { state: { teacherID } })}>Home</a></li>
                    <li><a onClick={() => navigate('/teacher/settings', { state: { teacherID } })}>Settings</a></li>
                    <li><a onClick={() => logout()}>Logout</a></li>
                </ul>
            </div>
        </div>
    )
}

export default NavbarHome