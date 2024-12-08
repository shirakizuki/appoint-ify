import React from 'react'

import { assets } from '../../../assets/assets'
import { useNavigate } from 'react-router-dom'

import './Navbar.css'

const NavbarClassic = () => {
    const navigate = useNavigate();
    return (
        <div className='navbar-container classic'>
            <div className="title-wrapper">
                <img src={assets.logo} alt="appointify_logo.png" className='title-img'/>
                <h1 className='title'>Appointify</h1>
            </div>
            <div className="nav-button-container">
                <ul>
                    <li><a onClick={() => navigate('/')}>Home</a></li>
                    <li><a onClick={() => navigate('/about-us')}>About Us</a></li>
                    <li><a onClick={() => navigate('/login')}>Login</a></li>
                    <li className='get-started-a'><a onClick={() => navigate('/appointment')}>Get Started</a></li>
                </ul>
            </div>
        </div>
    )
}

export default NavbarClassic