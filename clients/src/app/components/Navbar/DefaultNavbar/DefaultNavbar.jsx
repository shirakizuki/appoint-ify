// IMPORT LIBRARY
import React from 'react'
// IMPORT HOOKS
import { def_assets } from '../../../../assets/assets'
import { useNavigate } from 'react-router-dom'
// IMPORT CSS STYLINGS
import './DefaultNavbar.css'

/**
 * The NavbarHome component renders a navigation bar for the home page.
 *
 * This component includes a title section with an image and a main title,
 * as well as navigation links for 'Home', 'About Us', and a 'Teachers' button.
 * The navigation links trigger different navigation functions when clicked.
 *
 * @returns {React.ReactElement} The rendered navigation bar component.
 */
const NavbarHome = () => {
  const navigate = useNavigate();
  return (
    <div className='navbar-home'>
      <div className="title-container">
        <img src={def_assets.appointify_logo} alt='appointment_logo' onClick={() => navigate('/')}/>
      </div>
      <div className="navigators">
        <ul>
          <li><a onClick={() => navigate('/')}>Home</a></li>
          <li><a onClick={() => navigate('/aboutus')}>About Us</a></li>
          <li><a onClick={() => navigate('/login')}>Login</a></li>
        </ul>
      </div>
    </div>
  )
}

export default NavbarHome