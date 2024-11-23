// IMPORT LIBRARY
import React from 'react';
import useSignOut from 'react-auth-kit/hooks/useSignOut'
// IMPORT HOOKS
import { admin_assets, def_assets } from '../../../assets/assets'
import { useNavigate } from 'react-router-dom';
// IMPOR CSS STYLINGS
import './Sidebar.css'

/**
 * Sidebar component renders a vertical navigation bar with icons and descriptions.
 * 
 * The component includes logo, navigational items, and a logout option. 
 * It highlights the active navigation item based on the `activeItem` prop.
 * 
 * @param {Object} props - The component props.
 * @param {string} props.activeItem - The currently active navigation item.
 * @param {Function} props.handleItemClick - Callback function to handle navigation item click.
 * 
 * @returns {JSX.Element} A rendered sidebar component.
 */
const Sidebar = ({ activeItem, handleItemClick }) => {
    const icons = [
        { default: admin_assets.home, active: admin_assets.homeActive, name: 'DASHBOARD' },
        { default: admin_assets.calendar, active: admin_assets.calendarActive, name: 'CALENDAR' },
        { default: admin_assets.appointment, active: admin_assets.appointmentActive, name: 'APPOINTMENT' },
        { default: admin_assets.member, active: admin_assets.memberActive, name: 'TEACHERS' }
    ]
    const signOut = useSignOut()
    const navigate = useNavigate()

    /**
     * Logs out the user by clearing the session and local storage and 
     * navigating to the root route.
     * 
     * This function is called when the user clicks the 'Logout' button in the
     * sidebar navigation bar.
     */
    const logout = () => {
        signOut()
        localStorage.clear()
        sessionStorage.clear()
        navigate('/')
    }

    return (
        <div className='sidebar'>
            {/* LOGO CONTAINER */}
            <div className="logo-cont">
                <img src={def_assets.appointify_logo} alt="appointify-logo" />
            </div>
            <div className="separator">
                <hr className='sidebar-hr' />
            </div>
            {/* NAVIGATION BUTTONS CONTAINER */}
            <div className="nav-cont">
                <div className="navigators">
                    {icons.map((icon, index) => (
                        <div key={index} className={`nav-item ${activeItem === icon.name ? 'active' : ''}`} onClick={() => handleItemClick(icon.name)}>
                            <img src={activeItem === icon.name ? icon.active : icon.default} alt={`nav-item-${index}`} className="nav-img"/>
                            <p className="nav-desc">{icon.name}</p>
                        </div>
                    ))}
                </div>
            </div>
            {/* SEPARATOR */}
            <div className="separator">
                <hr className='sidebar-hr' />
            </div>
            {/* MENU CONTAINERS */}
            <div className="menu-cont">
                <div className="nav-item">
                    <img src={admin_assets.settings} alt="member-item" className="nav-img" />
                </div>
                <div className="nav-item">
                    <a onClick={logout}>LOGOUT</a>
                </div>
            </div>
        </div>
    )
}

export default Sidebar
