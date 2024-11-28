import React from 'react'

import { def_assets } from '../../../assets/assets'

import './Footer.css'

const Footer = () => {
  return (
    <div className='footer'>
      <div className="wrapper">
        <div className="title">
            <img src={def_assets.appointify_logo} alt="" />
            <h1>Appointify</h1>
        </div>
        <div className="content">
            <p>© 2024 Appointify. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

export default Footer
