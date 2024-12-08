import React from 'react'

import { assets } from '../../../assets/assets'
import { useNavigate } from 'react-router-dom';
import { useSignOut } from '../../context/ServerContext'
import { RiUser3Line, RiLogoutBoxLine } from "react-icons/ri";

import './Navbar.css'

const NavbarTeacher = () => {

    const signOut = useSignOut();
    const navigate = useNavigate();

    const logout = () => {
        signOut();
        localStorage.clear();
        sessionStorage.clear();
        navigate('/login');
    }
    
    return (
        <div className='navbar-container admin'>
            <div className="title-wrapper">
                <img src={assets.logo} alt="appointify_logo.png" className='title-img'/>
                <h1 className='title'>Appointify</h1>
            </div>
            <div className="nav-button-container">
                <div className='sidebar-icon' onClick={logout}>
                    <RiLogoutBoxLine className='icon'/>
                </div>
            </div>
        </div>
    )
}

export default NavbarTeacher
