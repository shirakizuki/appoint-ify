import React from 'react'

import { assets } from '../../../assets/assets'

import './Footer.css'

const Footer = () => {
    return (
        <div className='footer-container'>
            <div className="footer-wrapper">
                <div className="footer-title">
                    <img src={assets.logo} alt="" />
                    <h1>Appointify</h1>
                </div>
                <div className="footer-content">
                    <p>© 2024 Appointify. All rights reserved.</p>
                </div>
            </div>
        </div>
    )
}

export default Footer
